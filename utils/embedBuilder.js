const { EmbedBuilder } = require('discord.js');

// Màu sắc cho các loại embed
const COLORS = {
  PRIMARY: 0x5865F2,    // Discord Blurple
  SUCCESS: 0x57F287,    // Green
  WARNING: 0xFEE75C,    // Yellow
  ERROR: 0xED4245,      // Red
  INFO: 0x5865F2,       // Blue
  GOLD: 0xF1C40F,       // Gold cho winner
  PURPLE: 0x9B59B6      // Purple
};

// Embed khi game bắt đầu
function gameStartEmbed(players, timeoutSeconds, pointsInfo) {
  const playerList = players.map((p, i) => `\`${i + 1}.\` ${p.username}`).join('\n');
  const firstPlayer = players[0];

  return new EmbedBuilder()
    .setColor(COLORS.PRIMARY)
    .setTitle('🎮 GAME NỐI TỪ BẮT ĐẦU!')
    .addFields(
      {
        name: '👥 Người chơi',
        value: playerList,
        inline: true
      },
      {
        name: '🏆 Điểm thưởng',
        value: pointsInfo,
        inline: true
      },
      {
        name: '📝 Quy tắc',
        value: [
          `⏱️ Mỗi lượt có **${timeoutSeconds} giây**`,
          '🔗 Từ phải bắt đầu bằng **âm tiết cuối** của từ trước',
          '📖 Từ phải **có nghĩa** trong từ điển',
          '🚫 Không được lặp lại từ đã dùng',
          '💀 Hết thời gian = bị loại'
        ].join('\n'),
        inline: false
      },
      {
        name: '💡 Ví dụ',
        value: '`con cá` → `cá kho` → `kho hàng` → `hàng hoá`...',
        inline: false
      }
    )
    .setFooter({ text: `🎯 ${firstPlayer.username}, hãy gửi từ đầu tiên!` })
    .setTimestamp();
}

// Embed thông báo lượt chơi
function turnEmbed(player, lastSyllable, timeoutSeconds) {
  return new EmbedBuilder()
    .setColor(COLORS.INFO)
    .setTitle(`⏰ Lượt của ${player.username}`)
    .setDescription(
      `📝 Từ phải bắt đầu bằng: **${lastSyllable}**\n` +
      `⏱️ Thời gian: **${timeoutSeconds} giây**`
    )
    .setTimestamp();
}

// Embed khi trả lời đúng
function successEmbed(username, word, nextSyllable) {
  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Chính xác!')
    .setDescription(
      `**${username}** đã trả lời: \`${word}\`\n\n` +
      `📝 Từ tiếp theo phải bắt đầu bằng: **${nextSyllable}**`
    )
    .setTimestamp();
}

// Embed khi bị loại (timeout)
function eliminationEmbed(username, reason = 'timeout') {
  const reasons = {
    timeout: 'đã hết thời gian',
    invalid: 'trả lời sai'
  };

  return new EmbedBuilder()
    .setColor(COLORS.ERROR)
    .setTitle('💀 Bị loại!')
    .setDescription(`**${username}** ${reasons[reason]}! Bị loại khỏi ván này.`)
    .setTimestamp();
}

// Embed kết quả game
function gameResultEmbed(rankings, totalPlayers) {
  const medals = ['🥇', '🥈', '🥉'];

  let resultList = rankings.map((player, i) => {
    const rank = i + 1;
    const medal = medals[i] || '📍';
    const points = (totalPlayers - rank) * 10;
    const winnerTag = rank === 1 ? ' 👑' : '';
    return `${medal} **#${rank}** ${player.username} - \`+${points} điểm\`${winnerTag}`;
  }).join('\n');

  const winner = rankings[0];

  return new EmbedBuilder()
    .setColor(COLORS.GOLD)
    .setTitle('🏁 KẾT QUẢ GAME NỐI TỪ')
    .setDescription(resultList)
    .setFooter({ text: `🎉 Chúc mừng ${winner.username} đã chiến thắng!` })
    .setTimestamp();
}

// Embed lỗi
function errorEmbed(message) {
  return new EmbedBuilder()
    .setColor(COLORS.ERROR)
    .setDescription(`❌ ${message}`);
}

// Embed phòng chờ
function waitingRoomEmbed(creator, players, minPlayers) {
  const playerList = players.map((p, i) => `\`${i + 1}.\` ${p.username}`).join('\n') || 'Chưa có ai';

  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle('🎮 PHÒNG CHỜ - GAME NỐI TỪ')
    .addFields(
      {
        name: '👑 Chủ phòng',
        value: creator.username,
        inline: true
      },
      {
        name: `👥 Người chơi (${players.length}/${minPlayers}+)`,
        value: playerList,
        inline: true
      }
    )
    .setDescription('Gõ `!join` để tham gia\nChủ phòng gõ `!start` để bắt đầu')
    .setFooter({ text: `Cần tối thiểu ${minPlayers} người để bắt đầu` })
    .setTimestamp();
}

// Embed tham gia thành công
function joinSuccessEmbed(username, currentCount) {
  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setDescription(`✅ **${username}** đã tham gia! (${currentCount} người chơi)`);
}

// Embed rời phòng
function leaveEmbed(username, currentCount) {
  return new EmbedBuilder()
    .setColor(COLORS.WARNING)
    .setDescription(`👋 **${username}** đã rời phòng! (${currentCount} người chơi)`);
}

module.exports = {
  COLORS,
  gameStartEmbed,
  turnEmbed,
  successEmbed,
  eliminationEmbed,
  gameResultEmbed,
  errorEmbed,
  waitingRoomEmbed,
  joinSuccessEmbed,
  leaveEmbed
};
