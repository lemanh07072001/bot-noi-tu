# 🚀 Hướng dẫn Deploy Bot lên VPS

## Yêu cầu
- VPS Ubuntu 20.04+ (hoặc CentOS)
- Node.js 18+
- MongoDB
- Git

## Bước 1: Cài đặt môi trường trên VPS

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra version
node -v
npm -v

# Cài PM2 (process manager)
sudo npm install -g pm2

# Cài MongoDB
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

## Bước 2: Clone project

```bash
# Clone repo
cd ~
git clone https://github.com/lemanh07072001/bot-noi-tu.git
cd bot-noi-tu

# Cài dependencies
npm install
```

## Bước 3: Cấu hình .env

```bash
# Tạo file .env
nano .env
```

Thêm nội dung:
```env
DISCORD_TOKEN=your_discord_bot_token_here
SERVER_ID=your_server_id
CHANNEL_ID=your_channel_id
MONGODB_URI=mongodb://localhost:27017/discord-noi-tu
```

Lưu file: `Ctrl+X` → `Y` → `Enter`

## Bước 4: Chạy bot với PM2

```bash
# Chạy bot
pm2 start ecosystem.config.js

# Xem logs
pm2 logs bot-noi-tu

# Xem trạng thái
pm2 status

# Tự động khởi động khi reboot
pm2 startup
pm2 save
```

## Các lệnh PM2 hữu ích

```bash
# Restart bot
pm2 restart bot-noi-tu

# Stop bot
pm2 stop bot-noi-tu

# Xóa bot khỏi PM2
pm2 delete bot-noi-tu

# Xem logs realtime
pm2 logs bot-noi-tu --lines 100

# Monitor
pm2 monit
```

## Cập nhật code mới

```bash
cd ~/bot-noi-tu
git pull origin main
npm install
pm2 restart bot-noi-tu
```

## Troubleshooting

### Lỗi MongoDB connection
```bash
# Kiểm tra MongoDB đang chạy
sudo systemctl status mongodb

# Restart MongoDB
sudo systemctl restart mongodb
```

### Lỗi bot crash liên tục
```bash
# Xem logs chi tiết
pm2 logs bot-noi-tu --err --lines 50

# Xem thông tin memory
pm2 monit
```

### Mở port firewall (nếu cần)
```bash
sudo ufw allow 22
sudo ufw allow 27017
sudo ufw enable
```
