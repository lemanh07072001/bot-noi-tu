const { EmbedBuilder } = require('discord.js');

/**
 * Base class cho tất cả các game
 * Các game mới kế thừa class này
 */
class BaseGame {
  constructor(channel, creator, config) {
    this.channelId = channel.id;
    this.channel = channel;
    this.creatorId = creator.id;
    this.players = [];
    this.isActive = false;
    this.timer = null;
    this.config = config;
  }

  // Thêm người chơi
  addPlayer(user) {
    if (this.players.some(p => p.userId === user.id)) {
      return { success: false, message: 'Bạn đã tham gia game rồi!' };
    }
    this.players.push({
      userId: user.id,
      id: user.id,
      username: user.username,
      isActive: true
    });
    return { success: true };
  }

  // Xóa người chơi
  removePlayer(userId) {
    const index = this.players.findIndex(p => p.userId === userId);
    if (index === -1) {
      return { success: false, message: 'Bạn chưa tham gia game!' };
    }
    this.players.splice(index, 1);
    return { success: true };
  }

  // Kiểm tra đủ người chơi
  hasEnoughPlayers() {
    return this.players.length >= this.config.minPlayers;
  }

  // Lấy số người chơi còn active
  getActivePlayers() {
    return this.players.filter(p => p.isActive);
  }

  // Clear timer
  clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  // Các method cần override
  async start() {
    throw new Error('Method start() must be implemented');
  }

  async handleInput(message) {
    throw new Error('Method handleInput() must be implemented');
  }

  async end() {
    throw new Error('Method end() must be implemented');
  }

  getWaitingEmbed() {
    throw new Error('Method getWaitingEmbed() must be implemented');
  }
}

module.exports = BaseGame;
