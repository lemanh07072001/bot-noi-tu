const { getLastSyllable, getFirstSyllable, isValidWord, isValidMeaningfulWord } = require('../utils/wordUtils');
const { gameStartEmbed, turnEmbed, successEmbed, eliminationEmbed, gameResultEmbed, errorEmbed } = require('../utils/embedBuilder');
const User = require('../models/User');
const config = require('../config/config');

// Helper: Cập nhật điểm người chơi (chỉ tăng điểm, không tăng wins)
async function updateUserPoints(userId, username, points) {
  try {
    const user = await User.findOneAndUpdate(
      { userId },
      {
        $inc: { points },
        $set: { username }
      },
      { upsert: true, new: true }
    );
    return user;
  } catch (error) {
    console.error('Lỗi cập nhật điểm:', error);
    return null;
  }
}

// Helper: Cập nhật wins cho người thắng
async function updateUserWins(userId) {
  try {
    await User.findOneAndUpdate(
      { userId },
      { $inc: { wins: 1 } }
    );
  } catch (error) {
    console.error('Lỗi cập nhật wins:', error);
  }
}

// Helper: Tính điểm theo thứ hạng
function calculateRankPoints(rank, totalPlayers) {
  const pointsPerRank = config.game.pointsPerRank;
  return (totalPlayers - rank) * pointsPerRank;
}

// Helper: Xử lý kết thúc game và tính điểm
async function handleGameEnd(game, channel, activeGames) {
  const totalPlayers = game.players.length;
  const eliminationOrder = game.eliminationOrder || [];
  const activePlayers = game.players.filter(p => p.isActive);

  // Thêm người còn lại vào danh sách (người thắng)
  if (activePlayers.length === 1) {
    eliminationOrder.push(activePlayers[0]);
  }

  // Đảo ngược để có thứ tự từ winner -> loser
  const rankings = [...eliminationOrder].reverse();

  // Cập nhật điểm cho từng người
  for (let i = 0; i < rankings.length; i++) {
    const player = rankings[i];
    const rank = i + 1;
    const points = calculateRankPoints(rank, totalPlayers);

    await updateUserPoints(player.id, player.username, points);

    if (rank === 1) {
      await updateUserWins(player.id);
    }
  }

  // Gửi embed kết quả
  const resultEmbed = gameResultEmbed(rankings, totalPlayers);
  await channel.send({ embeds: [resultEmbed] });
  activeGames.delete(game.channelId);
}

// Helper: Xử lý timeout người chơi
async function handlePlayerTimeout(game, player, channel, activeGames) {
  player.isActive = false;

  // Track thứ tự bị loại
  if (!game.eliminationOrder) game.eliminationOrder = [];
  game.eliminationOrder.push(player);

  // Gửi embed bị loại
  const elimEmbed = eliminationEmbed(player.username, 'timeout');
  await channel.send({ embeds: [elimEmbed] });

  const activePlayers = game.players.filter(p => p.isActive);
  if (activePlayers.length <= 1) {
    await handleGameEnd(game, channel, activeGames);
    return true;
  }
  return false;
}

// Chuyển lượt tiếp theo
function nextTurn(game, channel, activeGames) {
  const { players } = game;
  let nextIndex = (game.currentPlayerIndex + 1) % players.length;

  for (let i = 0; i < players.length; i++) {
    if (players[nextIndex].isActive) {
      game.currentPlayerIndex = nextIndex;
      const currentPlayer = players[nextIndex];
      const timeoutSeconds = config.game.turnTimeout / 1000;

      // Gửi embed lượt chơi
      const turnMsg = turnEmbed(currentPlayer, game.lastSyllable, timeoutSeconds);
      channel.send({ embeds: [turnMsg] });

      game.timer = setTimeout(async () => {
        const gameEnded = await handlePlayerTimeout(game, currentPlayer, channel, activeGames);
        if (!gameEnded) {
          game.timer = null;
          nextTurn(game, channel, activeGames);
        }
      }, config.game.turnTimeout);

      return;
    }
    nextIndex = (nextIndex + 1) % players.length;
  }
}

// Bắt đầu game
async function startGame(waitingGame, channel, activeGames) {
  if (waitingGame.startTimer) {
    clearTimeout(waitingGame.startTimer);
    waitingGame.startTimer = null;
  }

  const game = {
    channelId: channel.id,
    players: [...waitingGame.players],
    currentPlayerIndex: 0,
    lastWord: null,
    lastSyllable: null,
    timer: null,
    creatorId: waitingGame.creatorId,
    usedWords: new Set(),
    eliminationOrder: []
  };

  // Xáo trộn người chơi (Fisher-Yates)
  for (let i = game.players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [game.players[i], game.players[j]] = [game.players[j], game.players[i]];
  }

  activeGames.set(channel.id, game);

  const timeoutSeconds = config.game.turnTimeout / 1000;
  const firstPlayer = game.players[0];
  const maxPoints = (game.players.length - 1) * config.game.pointsPerRank;
  const pointsInfo = `🥇 ${maxPoints} → 🥈 ${maxPoints - 10} → ... → 0`;

  // Gửi embed game bắt đầu
  const startEmbed = gameStartEmbed(game.players, timeoutSeconds, pointsInfo);
  await channel.send({ embeds: [startEmbed] });

  game.timer = setTimeout(async () => {
    const gameEnded = await handlePlayerTimeout(game, firstPlayer, channel, activeGames);
    if (!gameEnded) {
      game.timer = null;
      nextTurn(game, channel, activeGames);
    }
  }, config.game.turnTimeout);
}

// Xử lý từ của người chơi
async function handlePlayerWord(game, message, activeGames) {
  const word = message.content.trim().toLowerCase();

  // Validate cú pháp
  if (!isValidWord(word)) {
    const errEmbed = errorEmbed('Từ không hợp lệ! Từ phải có ít nhất 2 ký tự và chỉ chứa chữ cái.');
    return message.reply({ embeds: [errEmbed] });
  }

  // Validate nghĩa
  const meaningCheck = await isValidMeaningfulWord(word);
  if (!meaningCheck.valid) {
    const errMsg = meaningCheck.reason === 'not_in_dictionary'
      ? `Từ **${word}** không có trong từ điển!`
      : 'Từ không hợp lệ!';
    const errEmbed = errorEmbed(errMsg);
    return message.reply({ embeds: [errEmbed] });
  }

  // Validate âm tiết đầu (nếu không phải từ đầu tiên)
  if (game.lastWord) {
    const firstSyllable = getFirstSyllable(word);
    if (firstSyllable !== game.lastSyllable) {
      const errEmbed = errorEmbed(`Từ phải bắt đầu bằng **${game.lastSyllable}**!`);
      return message.reply({ embeds: [errEmbed] });
    }

    // Validate từ trùng
    if (game.usedWords.has(word)) {
      const errEmbed = errorEmbed(`Từ **${word}** đã được sử dụng!`);
      return message.reply({ embeds: [errEmbed] });
    }
  }

  // Clear timer và cập nhật game
  if (game.timer) {
    clearTimeout(game.timer);
    game.timer = null;
  }

  game.lastWord = word;
  game.lastSyllable = getLastSyllable(word);
  game.usedWords.add(word);

  // Gửi embed thành công
  message.react('✅');
  const successMsg = successEmbed(message.author.username, word, game.lastSyllable);
  await message.reply({ embeds: [successMsg] });

  nextTurn(game, message.channel, activeGames);
}

module.exports = {
  nextTurn,
  startGame,
  handlePlayerWord
};
