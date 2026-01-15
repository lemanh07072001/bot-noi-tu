const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 Thiết lập Bot Discord - Game Nối Từ\n');
console.log('Nhập thông tin cấu hình:\n');

rl.question('Discord Bot Token: ', (token) => {
  rl.question('Server ID (Enter để bot hoạt động ở tất cả servers, hoặc nhập ID để giới hạn): ', (serverId) => {
    rl.question('Channel ID (Enter để bot hoạt động ở tất cả channels, hoặc nhập ID để giới hạn): ', (channelId) => {
      rl.question('MongoDB URI (Enter để dùng mặc định mongodb://localhost:27017/discord-noi-tu): ', (mongoUri) => {
        let envContent = `# Discord Bot Token
# Lấy từ: https://discord.com/developers/applications
DISCORD_TOKEN=${token}

# Server ID (để trống = tất cả servers, hoặc nhập ID để giới hạn)
# Cách lấy Server ID: Bật Developer Mode → Right click server name → Copy ID
${serverId ? `SERVER_ID=${serverId}` : '# SERVER_ID='}

# Channel ID (để trống = tất cả channels, hoặc nhập ID để giới hạn)
# Cách lấy Channel ID: Bật Developer Mode → Right click channel → Copy ID
${channelId ? `CHANNEL_ID=${channelId}` : '# CHANNEL_ID='}

# MongoDB Connection String
MONGODB_URI=${mongoUri || 'mongodb://localhost:27017/discord-noi-tu'}
`;

        fs.writeFileSync('.env', envContent);
        console.log('\n✅ Đã tạo file .env thành công!');
        console.log('📝 File .env đã được thêm vào .gitignore để bảo mật.');
        if (serverId) {
          console.log(`📌 Bot sẽ chỉ hoạt động trong server ID: ${serverId}`);
        } else {
          console.log('📌 Bot sẽ hoạt động ở tất cả servers');
        }
        if (channelId) {
          console.log(`📌 Bot sẽ chỉ hoạt động trong channel ID: ${channelId}`);
        } else {
          console.log('📌 Bot sẽ hoạt động ở tất cả channels');
        }
        console.log();
        rl.close();
      });
    });
  });
});

