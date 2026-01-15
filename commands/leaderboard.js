const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');

async function execute(message) {
  try {
    const topUsers = await User.find()
      .sort({ points: -1 })
      .limit(10)
      .exec();

    if (topUsers.length === 0) {
      const emptyEmbed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setDescription('📊 Chưa có ai trong bảng xếp hạng!');
      return message.reply({ embeds: [emptyEmbed] });
    }

    const medals = ['🥇', '🥈', '🥉'];
    let leaderboardList = topUsers.map((user, index) => {
      const medal = medals[index] || `\`${index + 1}.\``;
      const winRate = user.wins > 0 ? ` (${user.wins} wins)` : '';
      return `${medal} **${user.username}** — \`${user.points}\` điểm${winRate}`;
    }).join('\n');

    const leaderboardEmbed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle('🏆 BẢNG XẾP HẠNG TOP 10')
      .setDescription(leaderboardList)
      .setFooter({ text: 'Game Nối Từ • Sử dụng !start để bắt đầu game mới' })
      .setTimestamp();

    message.reply({ embeds: [leaderboardEmbed] });
  } catch (error) {
    console.error('Lỗi khi lấy xếp hạng:', error);
    const errorEmbed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription('❌ Có lỗi xảy ra khi lấy bảng xếp hạng!');
    message.reply({ embeds: [errorEmbed] });
  }
}

module.exports = {
  name: 'leaderboard',
  aliases: ['xephang', 'top', 'rank'],
  execute
};
