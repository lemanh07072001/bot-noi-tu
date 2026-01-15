# 🔧 Khắc phục sự cố

## ❌ Không thấy server khi thêm bot

### Nguyên nhân và cách khắc phục:

#### 1. **Không có quyền "Manage Server"**

**Vấn đề**: Bạn không có quyền quản lý server nên không thể thêm bot.

**Giải pháp**:
- Yêu cầu chủ server cấp quyền "Manage Server" cho bạn
- Hoặc yêu cầu chủ server thêm bot thay bạn

**Cách cấp quyền**:
1. Vào Server Settings → Roles
2. Chọn role của bạn (hoặc tạo role mới)
3. Bật quyền "Manage Server"
4. Lưu lại

#### 2. **Bot đã được thêm vào server**

**Kiểm tra**:
- Vào server → Xem danh sách thành viên
- Tìm "Nối Từ Bot" trong danh sách

**Nếu bot đã có**:
- Bot có thể đang offline
- Chạy bot: `npm start`
- Kiểm tra bot có online không (dấu xanh)

#### 3. **Refresh trang**

**Thử**:
1. Refresh trang (F5 hoặc Ctrl+R)
2. Đăng xuất và đăng nhập lại Discord
3. Thử trình duyệt khác (Chrome, Firefox, Edge)
4. Xóa cache trình duyệt

#### 4. **Tạo server mới để test**

Nếu không có server nào để test:
1. Tạo server mới trong Discord
2. Bạn sẽ tự động có quyền "Manage Server"
3. Thử thêm bot vào server mới này

## 🔐 Các lỗi khác

### Bot không phản hồi lệnh

**Nguyên nhân**:
- Bot chưa chạy
- Bot không có quyền trong channel
- Channel ID bị giới hạn trong config

**Giải pháp**:
1. Kiểm tra bot đang chạy: `npm start`
2. Kiểm tra bot có quyền "Send Messages" trong channel
3. Kiểm tra file `.env`:
   - Nếu có `CHANNEL_ID`, bot chỉ hoạt động trong channel đó
   - Để trống `CHANNEL_ID=` để bot hoạt động ở tất cả channels

### Lỗi kết nối MongoDB

**Nguyên nhân**:
- MongoDB chưa chạy (nếu dùng local)
- Connection string sai
- Firewall chặn kết nối

**Giải pháp**:
1. Kiểm tra MongoDB đang chạy:
   ```bash
   # Windows
   net start MongoDB
   
   # Hoặc kiểm tra trong Services
   ```
2. Kiểm tra connection string trong `.env`
3. Thử dùng MongoDB Atlas (cloud) thay vì local

### Token không hợp lệ

**Nguyên nhân**:
- Token đã bị reset
- Token sai format
- Token đã hết hạn

**Giải pháp**:
1. Lấy token mới từ Discord Developer Portal
2. Cập nhật vào file `.env`
3. Restart bot

## 📞 Cần giúp đỡ thêm?

1. Kiểm tra console logs để xem lỗi cụ thể
2. Đảm bảo đã làm theo đúng các bước trong [TEST.md](TEST.md)
3. Kiểm tra file `.env` có đúng format không

