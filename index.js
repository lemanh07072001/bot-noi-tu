const config = require('./config/config');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { connectDatabase } = require('./config/database');
const readyEvent = require('./events/ready');
const messageCreateEvent = require('./events/messageCreate');
const interactionCreateEvent = require('./events/interactionCreate');

// Khởi tạo client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Collection để lưu trữ các game đang diễn ra
const activeGames = new Collection();
// Collection để lưu trữ các game đang chờ người chơi join
const waitingGames = new Collection();

// Kết nối MongoDB
connectDatabase(config.mongoUri);

// Đăng ký events
readyEvent(client);
messageCreateEvent(client, activeGames, waitingGames);
interactionCreateEvent(client, activeGames, waitingGames);

// Xử lý lỗi
client.on('error', console.error);

// Đăng nhập bot
if (!config.discordToken) {
  console.error('❌ Lỗi: DISCORD_TOKEN không được tìm thấy trong file .env!');
  console.error('💡 Chạy: npm run setup để tạo file .env');
  process.exit(1);
}

client.login(config.discordToken);
