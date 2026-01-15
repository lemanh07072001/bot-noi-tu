const { EmbedBuilder } = require('discord.js');
const User = require('../models/User');

async function execute(message) {
  try {
    const userId = message.author.id;
    const user = await User.findOne({ userId });

    if (!user) {
      const noDataEmbed = new EmbedBuilder()
        .setColor(0xFEE75C)
        .setDescription('📊 Bạn chưa chơi game nào! Gõ `!start` để bắt đầu.');
      return message.reply({ embeds: [noDataEmbed] });
    }

    // Tính rank của người chơi
    const rank = await User.countDocuments({ points: { $gt: user.points } }) + 1;

    const statsEmbed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📊 Thống kê của ${message.author.username}`)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .addFields(
        {
          name: '🏆 Xếp hạng',
          value: `#${rank}`,
          inline: true
        },
        {
          name: '💰 Tổng điểm',
          value: `${user.points}`,
          inline: true
        },
        {
          name: '👑 Số lần thắng',
          value: `${user.wins}`,
          inline: true
        }
      )
      .setFooter({ text: 'Game Nối Từ • Sử dụng !top để xem bảng xếp hạng' })
      .setTimestamp();

    message.reply({ embeds: [statsEmbed] });
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    const errorEmbed = new EmbedBuilder()
      .setColor(0xED4245)
      .setDescription('❌ Có lỗi xảy ra khi lấy thống kê!');
    message.reply({ embeds: [errorEmbed] });
  }
}

module.exports = {
  name: 'me',
  aliases: ['stats', 'mystats', 'profile'],
  execute
};
