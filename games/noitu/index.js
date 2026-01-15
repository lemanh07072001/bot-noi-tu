/**
 * Game Nối Từ - Entry point
 */

const handler = require('./handler');
const { createWaitingEmbed } = require('./embeds');

module.exports = {
  // Thông tin game
  name: 'Nối Từ',
  description: 'Nối từ theo âm tiết cuối',
  emoji: '🔗',
  enabled: true,

  // Handlers
  handler,
  createWaitingEmbed,

  // Tạo phòng chờ
  createRoom: handler.createRoom,

  // Bắt đầu game
  startGame: handler.startGame,

  // Xử lý input
  handleInput: handler.handlePlayerWord
};
