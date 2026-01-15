const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

async function execute(message) {
  const prefix = config.prefix;
  const timeoutSeconds = config.game.turnTimeout / 1000;

  const helpEmbed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('📖 HƯỚNG DẪN GAME NỐI TỪ')
    .setDescription('Game nối từ tiếng Việt - Nối từ theo âm tiết cuối!')
    .addFields(
      {
        name: '🎮 Lệnh Game',
        value: [
          `\`${prefix}start\` - Tạo phòng chờ mới`,
          `\`${prefix}stop\` - Dừng game hiện tại`,
        ].join('\n'),
        inline: true
      },
      {
        name: '📊 Lệnh Thống Kê',
        value: [
          `\`${prefix}top\` - Bảng xếp hạng Top 10`,
          `\`${prefix}me\` - Xem điểm cá nhân`,
        ].join('\n'),
        inline: true
      },
      {
        name: '📝 Cách Chơi',
        value: [
          '1️⃣ Gõ `!start` để tạo phòng',
          '2️⃣ Nhấn nút **Tham gia** để vào game',
          '3️⃣ Khi đủ người, game tự động bắt đầu',
          '4️⃣ Người đầu tiên gõ từ bất kỳ',
          '5️⃣ Người tiếp theo nối từ theo **âm tiết cuối**',
        ].join('\n'),
        inline: false
      },
      {
        name: '🔗 Quy Tắc Nối Từ',
        value: [
          '• Từ phải bắt đầu bằng **âm tiết cuối** của từ trước',
          '• Ví dụ: `con cá` → `cá kho` → `kho hàng` → `hàng hoá`',
          '• Từ phải có nghĩa trong từ điển',
          '• Không được lặp lại từ đã dùng',
        ].join('\n'),
        inline: false
      },
      {
        name: '⏱️ Thời Gian & Điểm',
        value: [
          `• Mỗi lượt có **${timeoutSeconds} giây** để trả lời`,
          '• Hết thời gian = bị loại khỏi ván',
          '• Điểm tính theo thứ hạng cuối game',
          '• 5 người: 🥇40 🥈30 🥉20 📍10 📍0',
        ].join('\n'),
        inline: false
      }
    )
    .setFooter({ text: 'Game Nối Từ • Chúc bạn chơi vui vẻ! 🎉' })
    .setTimestamp();

  message.reply({ embeds: [helpEmbed] });
}

module.exports = {
  name: 'help',
  aliases: ['huongdan', 'hd', 'h', '?'],
  execute
};
