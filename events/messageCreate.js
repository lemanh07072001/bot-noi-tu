const config = require('../config/config');
const startCommand = require('../commands/start');
const stopCommand = require('../commands/stop');
const leaderboardCommand = require('../commands/leaderboard');
const meCommand = require('../commands/me');
const helpCommand = require('../commands/help');
const { getGame } = require('../games/registry');

module.exports = (client, activeGames, waitingGames) => {
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Kiểm tra server/channel
    if (config.serverId && message.guild.id !== config.serverId) return;
    if (config.channelId && message.channel.id !== config.channelId) return;

    const prefix = config.prefix;
    if (!message.content.startsWith(prefix)) {
      // Xử lý input game
      const gameId = message.channel.id;
      if (activeGames.has(gameId)) {
        const game = activeGames.get(gameId);

        const playerIndex = game.players.findIndex(p => p.userId === message.author.id);
        if (playerIndex === -1) return;
        if (game.currentPlayerIndex !== playerIndex) return;

        // Lấy game module và xử lý input
        const gameModule = getGame(game.gameType);
        if (gameModule && gameModule.handleInput) {
          await gameModule.handleInput(game, message, activeGames);
        }
      }
      return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Commands
    if (command === startCommand.name || startCommand.aliases.includes(command)) {
      return startCommand.execute(message, activeGames, waitingGames);
    }

    if (command === stopCommand.name || stopCommand.aliases.includes(command)) {
      return stopCommand.execute(message, activeGames, waitingGames);
    }

    if (command === leaderboardCommand.name || leaderboardCommand.aliases.includes(command)) {
      return leaderboardCommand.execute(message);
    }

    if (command === meCommand.name || meCommand.aliases.includes(command)) {
      return meCommand.execute(message);
    }

    if (command === helpCommand.name || helpCommand.aliases.includes(command)) {
      return helpCommand.execute(message);
    }
  });
};
