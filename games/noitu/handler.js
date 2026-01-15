const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config/config');
const User = require('../../models/User');
const { getLastSyllable, getFirstSyllable, isValidWord, isValidMeaningfulWord } = require('./wordUtils');
const {
  createWaitingEmbed,
  createGameStartEmbed,
  createTurnEmbed,
  createSuccessEmbed,
  createEliminationEmbed,
  createResultEmbed,
  createErrorEmbed
} = require('./embeds');

// Cập nhật điểm người chơi
async function updateUserPoints(userId, username, points) {
  try {
    return await User.findOneAndUpdate(
      { userId },
      { $inc: { points }, $set: { username } },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Lỗi cập nhật điểm:', error);
    return null;
  }
}

// Cập nhật wins
async function updateUserWins(userId) {
  try {
    await User.findOneAndUpdate({ userId }, { $inc: { wins: 1 } });
  } catch (error) {
    console.error('Lỗi cập nhật wins:', error);
  }
}

// Tính điểm theo thứ hạng
function calculateRankPoints(rank, totalPlayers) {
  return (totalPlayers - rank) * config.game.pointsPerRank;
}

// Kết thúc game
async function handleGameEnd(game, channel, activeGames) {
  const totalPlayers = game.players.length;
  const eliminationOrder = game.eliminationOrder || [];
  const activePlayers = game.players.filter(p => p.isActive);

  if (activePlayers.length === 1) {
    eliminationOrder.push(activePlayers[0]);
  }

  const rankings = [...eliminationOrder].reverse();

  for (let i = 0; i < rankings.length; i++) {
    const player = rankings[i];
    const rank = i + 1;
    const points = calculateRankPoints(rank, totalPlayers);

    await updateUserPoints(player.id, player.username, points);
    if (rank === 1) await updateUserWins(player.id);
  }

  const resultEmbed = createResultEmbed(rankings, totalPlayers);
  await channel.send({ embeds: [resultEmbed] });
  activeGames.delete(game.channelId);
}

// Timeout người chơi
async function handlePlayerTimeout(game, player, channel, activeGames) {
  player.isActive = false;

  if (!game.eliminationOrder) game.eliminationOrder = [];
  game.eliminationOrder.push(player);

  const elimEmbed = createEliminationEmbed(player.username, 'timeout');
  await channel.send({ embeds: [elimEmbed] });

  const activePlayers = game.players.filter(p => p.isActive);
  if (activePlayers.length <= 1) {
    await handleGameEnd(game, channel, activeGames);
    return true;
  }
  return false;
}

// Chuyển lượt
function nextTurn(game, channel, activeGames) {
  const { players } = game;
  let nextIndex = (game.currentPlayerIndex + 1) % players.length;

  for (let i = 0; i < players.length; i++) {
    if (players[nextIndex].isActive) {
      game.currentPlayerIndex = nextIndex;
      const currentPlayer = players[nextIndex];
      const timeoutSeconds = config.game.turnTimeout / 1000;

      const turnEmbed = createTurnEmbed(currentPlayer, game.lastSyllable, timeoutSeconds);
      channel.send({ embeds: [turnEmbed] });

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

// Tạo phòng chờ
async function createRoom(interaction, waitingGames) {
  const gameId = interaction.channel.id;

  const waitingGame = {
    channelId: interaction.channel.id,
    gameType: 'noitu',
    players: [],
    minPlayers: config.game.minPlayers,
    messageId: null,
    creatorId: interaction.user.id
  };

  waitingGames.set(gameId, waitingGame);

  const joinButton = new ButtonBuilder()
    .setCustomId('join_game')
    .setLabel('Tham gia')
    .setStyle(ButtonStyle.Success)
    .setEmoji('🎮');

  const leaveButton = new ButtonBuilder()
    .setCustomId('leave_game')
    .setLabel('Rời phòng')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('🚪');

  const startButton = new ButtonBuilder()
    .setCustomId('force_start')
    .setLabel('Bắt đầu ngay')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('▶️');

  const row = new ActionRowBuilder().addComponents(joinButton, leaveButton, startButton);
  const waitingEmbed = createWaitingEmbed(waitingGame.players, waitingGame.minPlayers);

  await interaction.update({
    embeds: [waitingEmbed],
    components: [row]
  });

  waitingGame.messageId = interaction.message.id;
}

// Bắt đầu game
async function startGame(waitingGame, channel, activeGames) {
  if (waitingGame.startTimer) {
    clearTimeout(waitingGame.startTimer);
    waitingGame.startTimer = null;
  }

  const game = {
    channelId: channel.id,
    gameType: 'noitu',
    players: [...waitingGame.players],
    currentPlayerIndex: 0,
    lastWord: null,
    lastSyllable: null,
    timer: null,
    creatorId: waitingGame.creatorId,
    usedWords: new Set(),
    eliminationOrder: []
  };

  // Xáo trộn người chơi
  for (let i = game.players.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [game.players[i], game.players[j]] = [game.players[j], game.players[i]];
  }

  activeGames.set(channel.id, game);

  const timeoutSeconds = config.game.turnTimeout / 1000;
  const firstPlayer = game.players[0];
  const maxPoints = (game.players.length - 1) * config.game.pointsPerRank;
  const pointsInfo = `🥇 ${maxPoints} → 🥈 ${maxPoints - 10} → ... → 0`;

  const startEmbed = createGameStartEmbed(game.players, timeoutSeconds, pointsInfo);
  await channel.send({ embeds: [startEmbed] });

  game.timer = setTimeout(async () => {
    const gameEnded = await handlePlayerTimeout(game, firstPlayer, channel, activeGames);
    if (!gameEnded) {
      game.timer = null;
      nextTurn(game, channel, activeGames);
    }
  }, config.game.turnTimeout);
}

// Xử lý từ người chơi
async function handlePlayerWord(game, message, activeGames) {
  const word = message.content.trim().toLowerCase();

  if (!isValidWord(word)) {
    const errEmbed = createErrorEmbed('Từ không hợp lệ! Từ phải có ít nhất 2 ký tự và chỉ chứa chữ cái.');
    return message.reply({ embeds: [errEmbed] });
  }

  const meaningCheck = await isValidMeaningfulWord(word);
  if (!meaningCheck.valid) {
    const errMsg = meaningCheck.reason === 'not_in_dictionary'
      ? `Từ **${word}** không có trong từ điển!`
      : 'Từ không hợp lệ!';
    return message.reply({ embeds: [createErrorEmbed(errMsg)] });
  }

  if (game.lastWord) {
    const firstSyllable = getFirstSyllable(word);
    if (firstSyllable !== game.lastSyllable) {
      return message.reply({ embeds: [createErrorEmbed(`Từ phải bắt đầu bằng **${game.lastSyllable}**!`)] });
    }

    if (game.usedWords.has(word)) {
      return message.reply({ embeds: [createErrorEmbed(`Từ **${word}** đã được sử dụng!`)] });
    }
  }

  if (game.timer) {
    clearTimeout(game.timer);
    game.timer = null;
  }

  game.lastWord = word;
  game.lastSyllable = getLastSyllable(word);
  game.usedWords.add(word);

  message.react('✅');
  const successEmbed = createSuccessEmbed(message.author.username, word, game.lastSyllable);
  await message.reply({ embeds: [successEmbed] });

  nextTurn(game, message.channel, activeGames);
}

module.exports = {
  createRoom,
  startGame,
  handlePlayerWord,
  nextTurn,
  handlePlayerTimeout,
  handleGameEnd,
  createWaitingEmbed
};
