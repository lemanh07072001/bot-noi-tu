# ⚡ Hướng dẫn nhanh

## 🚀 Setup trong 3 bước

### 1. Cài đặt
```bash
npm install
```

### 2. Tạo file .env (Lưu token Discord)
```bash
npm run setup
```
Hoặc:
```bash
node setup.js
```

Nhập:
- **Discord Bot Token** (lấy từ https://discord.com/developers/applications)
- **MongoDB URI** (Enter để dùng mặc định)

### 3. Chạy bot
```bash
npm start
```

## 📝 Tạo file .env thủ công

Nếu không dùng script, tạo file `.env` với nội dung:

```env
DISCORD_TOKEN=your_token_here
MONGODB_URI=mongodb://localhost:27017/discord-noi-tu
```

## 🎮 Test

1. Gõ `!start` trong Discord
2. Click button "Tham gia game"
3. Chơi thử!

## 📚 Xem thêm

- **[TEST.md](TEST.md)** - Hướng dẫn test chi tiết
- **[README.md](README.md)** - Tài liệu đầy đủ

