require('dotenv').config();

module.exports = {
  // Discord Bot Token
  discordToken: process.env.DISCORD_TOKEN || '',
  
  // Server ID (để giới hạn bot chỉ hoạt động trong server cụ thể, để trống = tất cả servers)
  serverId: process.env.SERVER_ID || null,
  
  // Channel ID (để giới hạn bot chỉ hoạt động trong channel cụ thể, để trống = tất cả channels)
  channelId: process.env.CHANNEL_ID || null,
  
  // MongoDB Connection String
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/discord-noi-tu',
  
  // Bot Prefix
  prefix: process.env.PREFIX || '!',
  
  // Game Settings
  game: {
    minPlayers: parseInt(process.env.MIN_PLAYERS) || 2,
    turnTimeout: parseInt(process.env.TURN_TIMEOUT) || 20000, // 20 giây
    startDelay: parseInt(process.env.START_DELAY) || 5000, // 5 giây
    pointsPerRank: parseInt(process.env.POINTS_PER_RANK) || 10 // Điểm cách nhau mỗi hạng
  }
};

