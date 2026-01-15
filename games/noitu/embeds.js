const { EmbedBuilder } = require('discord.js');
const config = require('../../config/config');

// Màu sắc
const COLORS = {
  PRIMARY: 0x5865F2,
  SUCCESS: 0x57F287,
  WARNING: 0xFEE75C,
  ERROR: 0xED4245,
  GOLD: 0xF1C40F,
  PURPLE: 0x9B59B6
};

// Embed phòng chờ
function createWaitingEmbed(players, minPlayers) {
  const playerList = players.length > 0
    ? players.map((p, i) => `\`${i + 1}.\` ${p.username}`).join('\n')
    : '_Chưa có ai tham gia_';

  const timeoutSeconds = config.game.turnTimeout / 1000;

  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle('🔗 GAME NỐI TỪ - PHÒNG CHỜ')
    .addFields(
      {
        name: `👥 Người chơi (${players.length}/${minPlayers}+)`,
        value: playerList,
        inline: true
      },
      {
        name: '📋 Thông tin',
        value: [
          `⏱️ Thời gian: **${timeoutSeconds}s**/lượt`,
          `👤 Tối thiểu: **${minPlayers}** người`,
          `🏆 Điểm theo thứ hạng`
        ].join('\n'),
        inline: true
      }
    )
    .setDescription('Nhấn **🎮 Tham gia** để vào game!')
    .setFooter({
      text: players.length >= minPlayers
        ? '✅ Đủ người! Game sẽ bắt đầu trong 5 giây...'
        : `⏳ Đang chờ thêm ${minPlayers - players.length} người...`
    })
    .setTimestamp();
}

// Embed game bắt đầu
function createGameStartEmbed(players, timeoutSeconds, pointsInfo) {
  const playerList = players.map((p, i) => `\`${i + 1}.\` ${p.username}`).join('\n');
  const firstPlayer = players[0];

  return new EmbedBuilder()
    .setColor(COLORS.PRIMARY)
    .setTitle('🔗 GAME NỐI TỪ BẮT ĐẦU!')
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
          '🔗 Từ bắt đầu bằng **âm tiết cuối** của từ trước',
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

// Embed lượt chơi
function createTurnEmbed(player, lastSyllable, timeoutSeconds) {
  return new EmbedBuilder()
    .setColor(COLORS.PRIMARY)
    .setTitle(`⏰ Lượt của ${player.username}`)
    .setDescription(
      `📝 Từ phải bắt đầu bằng: **${lastSyllable}**\n` +
      `⏱️ Thời gian: **${timeoutSeconds} giây**`
    )
    .setTimestamp();
}

// Embed trả lời đúng
function createSuccessEmbed(username, word, nextSyllable) {
  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Chính xác!')
    .setDescription(
      `**${username}** đã trả lời: \`${word}\`\n\n` +
      `📝 Từ tiếp theo bắt đầu bằng: **${nextSyllable}**`
    )
    .setTimestamp();
}

// Embed bị loại
function createEliminationEmbed(username, reason = 'timeout') {
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
function createResultEmbed(rankings, totalPlayers) {
  const medals = ['🥇', '🥈', '🥉'];

  const resultList = rankings.map((player, i) => {
    const rank = i + 1;
    const medal = medals[i] || '📍';
    const points = (totalPlayers - rank) * config.game.pointsPerRank;
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
function createErrorEmbed(message) {
  return new EmbedBuilder()
    .setColor(COLORS.ERROR)
    .setDescription(`❌ ${message}`);
}

module.exports = {
  COLORS,
  createWaitingEmbed,
  createGameStartEmbed,
  createTurnEmbed,
  createSuccessEmbed,
  createEliminationEmbed,
  createResultEmbed,
  createErrorEmbed
};
