# 🧪 Hướng dẫn Test Bot

## 📋 Bước 1: Cài đặt Dependencies

```bash
npm install
```

## 📋 Bước 2: Cấu hình MongoDB

### Option 1: MongoDB Local (Máy tính của bạn)

1. **Cài đặt MongoDB** (nếu chưa có):
   - Tải từ: https://www.mongodb.com/try/download/community
   - Hoặc dùng Docker: `docker run -d -p 27017:27017 mongo`

2. **Khởi động MongoDB**:
   ```bash
   # Windows (nếu cài đặt thông thường)
   net start MongoDB
   
   # Hoặc chạy mongod.exe từ thư mục cài đặt
   ```

### Option 2: MongoDB Atlas (Cloud - Miễn phí)

1. Đăng ký tại: https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string (dạng: `mongodb+srv://username:password@cluster.mongodb.net/database`)

## 📋 Bước 3: Tạo Discord Bot

1. **Truy cập Discord Developer Portal**:
   - https://discord.com/developers/applications
   - Đăng nhập với tài khoản Discord

2. **Tạo Application mới**:
   - Click "New Application"
   - Đặt tên (ví dụ: "Noi Tu Bot")
   - Click "Create"

3. **Tạo Bot**:
   - Vào tab "Bot" ở menu bên trái
   - Click "Add Bot" → "Yes, do it!"
   - Copy **Token** (giữ bí mật!)

4. **Bật các Privileged Gateway Intents**:
   - Trong tab "Bot", scroll xuống "Privileged Gateway Intents"
   - Bật: ✅ **MESSAGE CONTENT INTENT** (quan trọng!)
   - Click "Save Changes"

5. **Mời bot vào server**:
   - Vào tab "OAuth2" → "URL Generator"
   - Chọn scope: `bot`
   - Chọn permissions:
     - ✅ Send Messages
     - ✅ Read Message History
     - ✅ Use Slash Commands (nếu dùng)
   - Copy URL và mở trong trình duyệt
   - Chọn server và authorize

## 📋 Bước 4: Tạo file .env

### Cách 1: Dùng script tự động (Khuyến nghị) ⭐

```bash
node setup.js
```

Script sẽ hỏi bạn:
- Discord Bot Token
- MongoDB URI (có thể Enter để dùng mặc định)

File `.env` sẽ được tạo tự động!

### Cách 2: Tạo thủ công

1. **Copy file mẫu**:
   ```bash
   # Windows
   copy env.example.txt .env
   
   # Linux/Mac
   cp env.example.txt .env
   ```

2. **Mở file `.env`** và điền thông tin:
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   MONGODB_URI=mongodb://localhost:27017/discord-noi-tu
   ```

**Lưu ý**: 
- Thay `your_discord_bot_token_here` bằng token thật của bạn
- File `.env` đã được thêm vào `.gitignore` để bảo mật

## 📋 Bước 5: Chạy Bot

```bash
npm start
```

Nếu thành công, bạn sẽ thấy:
```
✅ Đã kết nối MongoDB
✅ Bot đã đăng nhập với tên: YourBotName#1234
```

## 🎮 Bước 6: Test các lệnh

### Test trong Discord Server:

1. **Test lệnh xếp hạng** (không cần game):
   ```
   !xephang
   ```
   Hoặc:
   ```
   !leaderboard
   !top
   ```

2. **Test tạo game**:
   ```
   !start
   ```
   Bot sẽ hiển thị button "Tham gia game"

3. **Test join game**:
   - Click button "Tham gia game"
   - Mời bạn bè click vào để có ít nhất 2 người
   - Game sẽ tự động bắt đầu sau 5 giây

4. **Test chơi game**:
   - Gửi từ đầu tiên (ví dụ: `hello`)
   - Bot sẽ yêu cầu từ tiếp theo bắt đầu bằng chữ cuối
   - Lần lượt từng người chơi trả lời
   - Mỗi lần đúng sẽ +10 điểm

5. **Test timer**:
   - Đợi 10 giây không trả lời
   - Bot sẽ tự động loại bạn khỏi ván

6. **Test kết thúc game**:
   ```
   !stop
   ```
   Hoặc:
   ```
   !ketthuc
   ```

## 🐛 Xử lý lỗi thường gặp

### Lỗi: "Cannot find module"
```bash
npm install
```

### Lỗi: "Invalid token"
- Kiểm tra lại token trong file `.env`
- Đảm bảo không có khoảng trắng thừa
- Token phải bắt đầu bằng `MT` hoặc `OD`

### Lỗi: "MongoServerError: Authentication failed"
- Kiểm tra lại MongoDB URI
- Đảm bảo MongoDB đang chạy (nếu dùng local)
- Kiểm tra username/password (nếu dùng Atlas)

### Lỗi: "Missing Access" khi mời bot
- Đảm bảo bạn có quyền "Manage Server" trong server
- Kiểm tra lại permissions khi tạo invite URL

### Bot không phản hồi lệnh
- Kiểm tra bot đã online chưa (có dấu xanh)
- Đảm bảo đã bật "MESSAGE CONTENT INTENT"
- Kiểm tra bot có quyền đọc tin nhắn trong channel

## ✅ Checklist test

- [ ] Bot đăng nhập thành công
- [ ] MongoDB kết nối thành công
- [ ] Lệnh `!xephang` hoạt động
- [ ] Lệnh `!start` tạo button join
- [ ] Click button join thành công
- [ ] Game tự động bắt đầu khi đủ người
- [ ] Gửi từ đầu tiên thành công
- [ ] Bot kiểm tra chữ cái cuối đúng
- [ ] +10 điểm khi trả lời đúng
- [ ] Timer 10 giây hoạt động
- [ ] Người chơi bị loại khi hết thời gian
- [ ] Lệnh `!stop` kết thúc game

## 💡 Tips

1. **Test với nhiều tài khoản**: Mở nhiều cửa sổ Discord để test nhiều người chơi
2. **Test timer**: Có thể giảm thời gian timer trong code để test nhanh hơn
3. **Xem logs**: Kiểm tra console để xem lỗi nếu có
4. **Test từ tiếng Việt**: Bot hỗ trợ tiếng Việt, thử test với từ có dấu

## 📞 Cần giúp đỡ?

Nếu gặp vấn đề, kiểm tra:
1. Console logs để xem lỗi cụ thể
2. Đảm bảo tất cả dependencies đã cài đặt
3. Kiểm tra file `.env` có đúng format không
4. Đảm bảo MongoDB và Discord bot đều hoạt động

