const { Collection } = require('discord.js');
const config = require('../config/config');
const startCommand = require('../commands/start');
const stopCommand = require('../commands/stop');
const leaderboardCommand = require('../commands/leaderboard');
const meCommand = require('../commands/me');
const helpCommand = require('../commands/help');
const { handlePlayerWord } = require('../handlers/gameHandler');

module.exports = (client, activeGames, waitingGames) => {
  client.on('messageCreate', async (message) => {
    // Bỏ qua tin nhắn từ bot
    if (message.author.bot) return;
    
    // Kiểm tra server ID nếu được cấu hình
    if (config.serverId && message.guild.id !== config.serverId) {
      return; // Chỉ hoạt động trong server được chỉ định
    }
    
    // Kiểm tra channel ID nếu được cấu hình
    if (config.channelId && message.channel.id !== config.channelId) {
      return; // Chỉ hoạt động trong channel được chỉ định
    }

    const prefix = config.prefix;
    if (!message.content.startsWith(prefix)) {
      // Kiểm tra xem có game đang chạy không
      const gameId = message.channel.id;
      if (activeGames.has(gameId)) {
        const game = activeGames.get(gameId);
        
        // Kiểm tra xem người chơi có trong danh sách không
        const playerIndex = game.players.findIndex(p => p.userId === message.author.id);
        if (playerIndex === -1) {
          return; // Người chơi không trong game, bỏ qua
        }

        // Kiểm tra xem có phải lượt của người chơi này không
        if (game.currentPlayerIndex !== playerIndex) {
          return; // Không phải lượt của họ, bỏ qua
        }

        // Xử lý từ của người chơi
        await handlePlayerWord(game, message, activeGames);
      }
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Lệnh bắt đầu game
    if (command === startCommand.name || startCommand.aliases.includes(command)) {
      await startCommand.execute(message, activeGames, waitingGames);
      return;
    }

    // Lệnh kết thúc game
    if (command === stopCommand.name || stopCommand.aliases.includes(command)) {
      await stopCommand.execute(message, activeGames, waitingGames);
      return;
    }

    // Lệnh xếp hạng
    if (command === leaderboardCommand.name || leaderboardCommand.aliases.includes(command)) {
      await leaderboardCommand.execute(message);
      return;
    }

    // Lệnh xem thống kê cá nhân
    if (command === meCommand.name || meCommand.aliases.includes(command)) {
      await meCommand.execute(message);
      return;
    }

    // Lệnh hướng dẫn
    if (command === helpCommand.name || helpCommand.aliases.includes(command)) {
      await helpCommand.execute(message);
      return;
    }
  });
};

