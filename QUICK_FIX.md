# ⚡ Sửa nhanh - Bot không thấy gì

## 🔍 Kiểm tra nhanh:

### 1. Bot có đang chạy không?

Mở terminal và chạy:
```bash
npm start
```

Bạn phải thấy:
```
✅ Đã kết nối MongoDB
✅ Bot đã đăng nhập với tên: Nối Từ Bot#2760
```

**Nếu không thấy** → Bot chưa chạy hoặc có lỗi!

### 2. Bot có online trong Discord không?

- Vào Discord server
- Xem danh sách thành viên
- Bot phải có **dấu xanh** (online)

**Nếu bot offline** → Token sai hoặc bot chưa được thêm vào server!

### 3. Kiểm tra SERVER_ID và CHANNEL_ID

Mở file `.env` và kiểm tra:

```env
# Nếu có điền SERVER_ID, bot chỉ hoạt động trong server đó
SERVER_ID=1234567890123456789

# Nếu có điền CHANNEL_ID, bot chỉ hoạt động trong channel đó  
CHANNEL_ID=9876543210987654321
```

**Nếu bạn đang test ở server/channel khác** → Bot sẽ không phản hồi!

**Giải pháp**: Để trống để test:
```env
SERVER_ID=
CHANNEL_ID=
```

### 4. Test lệnh đơn giản

Trong Discord, gõ:
```
!xephang
```

**Nếu không phản hồi** → Kiểm tra:
- Bot có online không?
- Bot có quyền "Send Messages" không?
- SERVER_ID/CHANNEL_ID có đúng không?

## 🛠️ Sửa nhanh:

### Cách 1: Để bot hoạt động ở tất cả nơi (Khuyến nghị để test)

Sửa file `.env`:
```env
DISCORD_TOKEN=your_token_here
SERVER_ID=
CHANNEL_ID=
MONGODB_URI=mongodb://localhost:27017/discord-noi-tu
```

Restart bot:
```bash
# Dừng bot (Ctrl+C)
npm start
```

### Cách 2: Kiểm tra ID đúng chưa

1. **Lấy Server ID:**
   - Bật Developer Mode
   - Right-click tên server → Copy Server ID
   - So sánh với SERVER_ID trong `.env`

2. **Lấy Channel ID:**
   - Right-click channel → Copy Channel ID
   - So sánh với CHANNEL_ID trong `.env`

### Cách 3: Kiểm tra quyền bot

1. Vào Server Settings → Roles
2. Tìm role của bot
3. Đảm bảo có:
   - ✅ Send Messages
   - ✅ Read Message History

## ✅ Test sau khi sửa:

1. Restart bot: `npm start`
2. Kiểm tra bot online (dấu xanh)
3. Gõ: `!xephang`
4. Bot phải phản hồi!

## 📞 Vẫn không được?

Kiểm tra console logs khi chạy `npm start`:
- Có lỗi gì không?
- MongoDB có kết nối được không?
- Token có hợp lệ không?

