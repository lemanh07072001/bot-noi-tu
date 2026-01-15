# 🐛 Debug - Bot không hoạt động

## ❌ Vấn đề: "Không thấy gì cả"

### Nguyên nhân thường gặp:

1. **File `.env` không tồn tại** ⚠️
2. **Token không đúng hoặc chưa được reset**
3. **Bot chưa được thêm vào server**
4. **Bot không có quyền trong channel**
5. **SERVER_ID hoặc CHANNEL_ID sai**

## 🔍 Kiểm tra từng bước:

### Bước 1: Kiểm tra file .env

```bash
# Windows PowerShell
Test-Path .env

# Nếu không có, tạo file:
npm run setup
```

### Bước 2: Kiểm tra nội dung file .env

File `.env` phải có:
```env
DISCORD_TOKEN=your_token_here
SERVER_ID=
CHANNEL_ID=
MONGODB_URI=mongodb://localhost:27017/discord-noi-tu
```

### Bước 3: Kiểm tra bot đang chạy

```bash
npm start
```

Bạn sẽ thấy:
```
✅ Đã kết nối MongoDB
✅ Bot đã đăng nhập với tên: YourBot#1234
```

Nếu không thấy, có lỗi!

### Bước 4: Kiểm tra bot trong Discord

1. Bot phải có dấu **xanh** (online) trong server
2. Nếu bot offline → Kiểm tra lại token
3. Nếu bot online nhưng không phản hồi → Kiểm tra quyền

### Bước 5: Kiểm tra SERVER_ID và CHANNEL_ID

Nếu bạn đã điền SERVER_ID hoặc CHANNEL_ID:

1. **Kiểm tra SERVER_ID đúng chưa:**
   - Right-click tên server → Copy Server ID
   - So sánh với SERVER_ID trong `.env`

2. **Kiểm tra CHANNEL_ID đúng chưa:**
   - Right-click channel → Copy Channel ID
   - So sánh với CHANNEL_ID trong `.env`

3. **Nếu không chắc, để trống:**
   ```env
   SERVER_ID=
   CHANNEL_ID=
   ```

### Bước 6: Kiểm tra quyền bot

Bot cần các quyền:
- ✅ Send Messages
- ✅ Read Message History
- ✅ Use Slash Commands (nếu dùng)

## 🛠️ Cách khắc phục:

### Nếu file .env không tồn tại:

```bash
npm run setup
```

Hoặc tạo thủ công:
1. Copy `env.example.txt` thành `.env`
2. Điền token vào file `.env`

### Nếu bot không đăng nhập:

1. **Kiểm tra token:**
   - Token phải bắt đầu bằng `MT` hoặc `OD`
   - Không có khoảng trắng thừa
   - Token phải mới (nếu đã reset)

2. **Reset token:**
   - https://discord.com/developers/applications
   - Tab "Bot" → "Reset Token"
   - Cập nhật vào `.env`

### Nếu bot không phản hồi lệnh:

1. **Kiểm tra prefix:**
   - Mặc định là `!`
   - Thử: `!start`, `!xephang`

2. **Kiểm tra SERVER_ID/CHANNEL_ID:**
   - Nếu có điền, đảm bảo đúng ID
   - Hoặc để trống để test

3. **Kiểm tra bot có quyền:**
   - Server Settings → Roles → Bot role
   - Bật "Send Messages"

## 📝 Checklist Debug:

- [ ] File `.env` tồn tại
- [ ] `DISCORD_TOKEN` có giá trị
- [ ] Token đúng format (bắt đầu bằng MT hoặc OD)
- [ ] Bot đã được thêm vào server
- [ ] Bot có dấu xanh (online)
- [ ] SERVER_ID đúng (nếu có điền)
- [ ] CHANNEL_ID đúng (nếu có điền)
- [ ] Bot có quyền "Send Messages"
- [ ] Đang dùng đúng prefix (`!`)
- [ ] MongoDB đang chạy (nếu dùng local)

## 💡 Test nhanh:

1. **Tạo file .env đơn giản:**
   ```env
   DISCORD_TOKEN=your_token_here
   SERVER_ID=
   CHANNEL_ID=
   MONGODB_URI=mongodb://localhost:27017/discord-noi-tu
   ```

2. **Chạy bot:**
   ```bash
   npm start
   ```

3. **Test trong Discord:**
   ```
   !xephang
   ```

Nếu vẫn không thấy gì, kiểm tra console logs để xem lỗi cụ thể!

