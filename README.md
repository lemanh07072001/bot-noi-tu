# 🤖 Discord Bot Game Nối Từ

Bot Discord đơn giản để chơi game nối từ với hệ thống điểm số và bảng xếp hạng sử dụng MongoDB.

## ✨ Tính năng

- 🎮 Game nối từ với button join
- 👥 Hỗ trợ nhiều người chơi (tối thiểu 2 người)
- ⏱️ Timer 10 giây cho mỗi lượt chơi
- 🚫 Tự động loại bỏ người chơi quá thời gian
- 💰 Hệ thống điểm: +10 điểm mỗi lần thắng
- 🏆 Bảng xếp hạng top 10
- 💾 Lưu trữ dữ liệu với MongoDB

## 📋 Yêu cầu

- Node.js 16.9.0 trở lên
- MongoDB (local hoặc MongoDB Atlas)
- Discord Bot Token

## 🚀 Cài đặt

1. **Clone hoặc tải project**

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Tạo file `.env` để lưu token:**

   **Cách 1: Dùng script tự động (Khuyến nghị)**
   ```bash
   node setup.js
   ```
   Script sẽ hỏi bạn nhập Discord Token và MongoDB URI

   **Cách 2: Tạo thủ công**
   - Copy file `env.example.txt` thành `.env`
   - Mở file `.env` và điền thông tin:
     - `DISCORD_TOKEN`: Token từ [Discord Developer Portal](https://discord.com/developers/applications)
     - `MONGODB_URI`: Connection string MongoDB

5. **Chạy bot:**
```bash
npm start
```

## 🧪 Test Bot

Xem file **[TEST.md](TEST.md)** để có hướng dẫn test chi tiết.

### Test nhanh:

1. **Kiểm tra bot đã online** trong Discord server
2. **Test lệnh xếp hạng**:
   ```
   !xephang
   ```
3. **Test tạo game**:
   ```
   !start
   ```
4. **Click button "Tham gia game"** và chơi thử!

> 💡 **Lưu ý**: Cần ít nhất 2 người để bắt đầu game. Bạn có thể mở nhiều cửa sổ Discord để test.

## 🎯 Lệnh

- `!start` hoặc `!noitu` - Tạo game mới với button join
- `!ketthuc` hoặc `!stop` - Kết thúc game hiện tại
- `!xephang` hoặc `!leaderboard` hoặc `!top` - Xem bảng xếp hạng top 10

## 🎮 Cách chơi

1. Gõ `!start` để tạo game mới
2. Click nút **"Tham gia game"** để tham gia (tối thiểu 2 người)
3. Game sẽ tự động bắt đầu sau 5 giây khi đủ người
4. Lần lượt từng người chơi trả lời:
   - Mỗi lượt có **10 giây** để trả lời
   - Từ phải bắt đầu bằng chữ cái cuối của từ trước
   - Từ phải có ít nhất 2 ký tự
5. Nếu quá 10 giây không trả lời, bạn sẽ bị loại khỏi ván đó
6. Mỗi lần trả lời đúng sẽ được +10 điểm
7. Người cuối cùng còn lại sẽ thắng

## 📝 Ví dụ

```
User1: !start
Bot: [Hiển thị button "Tham gia game"]
     Game nối từ - Đang chờ người chơi...

User2: [Click button "Tham gia game"]
User3: [Click button "Tham gia game"]
Bot: Game đã bắt đầu!
     Lượt của User1 - Hãy gửi từ đầu tiên (10 giây)

User1: hello
Bot: User1 +10 điểm! Từ tiếp theo phải bắt đầu bằng chữ O
     Lượt của User2 (10 giây)

User2: orange
Bot: User2 +10 điểm! Từ tiếp theo phải bắt đầu bằng chữ E
     Lượt của User3 (10 giây)

[... nếu User3 không trả lời trong 10 giây ...]
Bot: User3 đã hết thời gian! Bị loại khỏi ván này.
     Lượt của User1 (10 giây)
```

## 🔧 Cấu trúc Project

```
.
├── index.js              # File bot chính
├── config/
│   └── database.js       # Cấu hình kết nối MongoDB
├── commands/             # Các lệnh bot
│   ├── start.js          # Lệnh bắt đầu game
│   ├── stop.js           # Lệnh kết thúc game
│   └── leaderboard.js    # Lệnh xem bảng xếp hạng
├── events/               # Xử lý sự kiện Discord
│   ├── ready.js          # Event khi bot sẵn sàng
│   ├── messageCreate.js  # Event khi có tin nhắn
│   └── interactionCreate.js # Event khi có interaction (button)
├── handlers/             # Logic xử lý game
│   └── gameHandler.js    # Xử lý logic game
├── models/               # Models MongoDB
│   └── User.js           # Model User
├── utils/                # Các hàm tiện ích
│   └── wordUtils.js      # Hàm xử lý từ
├── .env                  # File cấu hình (tự tạo)
├── package.json          # Dependencies
└── README.md             # File này
```

## 📦 Dependencies

- `discord.js` - Discord API library
- `mongoose` - MongoDB ODM
- `dotenv` - Quản lý biến môi trường

## ⚠️ Lưu ý

- Bot cần quyền đọc và gửi tin nhắn trong channel
- Đảm bảo MongoDB đang chạy hoặc có kết nối internet nếu dùng MongoDB Atlas

## 📄 License

MIT

