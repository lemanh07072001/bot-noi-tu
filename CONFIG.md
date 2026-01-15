# ⚙️ Hướng dẫn cấu hình

## 📁 File Config

Tất cả cấu hình được lưu trong file `.env` và được load vào `config/config.js`.

## 🔑 Các biến môi trường

### Bắt buộc

- **`DISCORD_TOKEN`**: Token của Discord Bot
  - Lấy từ: https://discord.com/developers/applications
  - Vào tab "Bot" → Copy "Token"

### Tùy chọn

- **`SERVER_ID`**: ID của server (để trống = tất cả servers)
  - Cách lấy: Bật Developer Mode trong Discord → Right click tên server → Copy ID
  - Nếu để trống, bot sẽ hoạt động ở tất cả servers
  - Nếu có giá trị, bot chỉ hoạt động trong server đó

- **`CHANNEL_ID`**: ID của channel (để trống = tất cả channels)
  - Cách lấy: Bật Developer Mode trong Discord → Right click channel → Copy ID
  - Nếu để trống, bot sẽ hoạt động ở tất cả channels
  - Nếu có giá trị, bot chỉ hoạt động trong channel đó

- **`MONGODB_URI`**: Connection string MongoDB
  - Mặc định: `mongodb://localhost:27017/discord-noi-tu`
  - Local: `mongodb://localhost:27017/discord-noi-tu`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/discord-noi-tu`

- **`PREFIX`**: Prefix cho lệnh bot
  - Mặc định: `!`

### Cấu hình Game (Tùy chọn)

- **`MIN_PLAYERS`**: Số người chơi tối thiểu
  - Mặc định: `2`

- **`TURN_TIMEOUT`**: Thời gian mỗi lượt (milliseconds)
  - Mặc định: `10000` (10 giây)

- **`START_DELAY`**: Thời gian chờ trước khi bắt đầu game (milliseconds)
  - Mặc định: `5000` (5 giây)

- **`POINTS_PER_WIN`**: Điểm mỗi lần thắng
  - Mặc định: `10`

## 📝 Ví dụ file .env

```env
# Bắt buộc
DISCORD_TOKEN=your_discord_bot_token_here

# Tùy chọn - Server ID
SERVER_ID=1234567890123456789

# Tùy chọn - Channel ID
CHANNEL_ID=1234567890123456789

# Tùy chọn - MongoDB
MONGODB_URI=mongodb://localhost:27017/discord-noi-tu

# Tùy chọn - Prefix
PREFIX=!

# Tùy chọn - Game Settings
MIN_PLAYERS=2
TURN_TIMEOUT=10000
START_DELAY=5000
POINTS_PER_WIN=10
```

## 🚀 Cách tạo file .env

### Cách 1: Dùng script (Khuyến nghị)

```bash
npm run setup
```

Script sẽ hỏi:
- Discord Bot Token
- Channel ID (có thể Enter để bỏ qua)
- MongoDB URI (có thể Enter để dùng mặc định)

### Cách 2: Tạo thủ công

1. Copy file mẫu:
   ```bash
   copy env.example.txt .env
   ```

2. Mở file `.env` và điền thông tin

## 🔒 Bảo mật

- File `.env` đã được thêm vào `.gitignore`
- **KHÔNG** commit file `.env` lên Git
- **KHÔNG** chia sẻ token với người khác
- Nếu token bị lộ, hãy reset ngay trong Discord Developer Portal

## 📌 Lưu ý

1. **Channel ID**: 
   - Để trống nếu muốn bot hoạt động ở tất cả channels
   - Nhập ID nếu muốn giới hạn bot chỉ hoạt động trong 1 channel

2. **Game Settings**:
   - Có thể tùy chỉnh trong file `.env`
   - Giá trị mặc định đã được tối ưu

3. **Sau khi thay đổi config**:
   - Cần restart bot để áp dụng thay đổi
   - Chạy lại: `npm start`

