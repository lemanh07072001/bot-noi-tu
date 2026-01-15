# 🔒 Bảo mật - Token đã bị lộ

## ⚠️ QUAN TRỌNG: Token Discord đã bị lộ!

Token Discord của bạn đã được commit lên Git và có thể đã bị lộ công khai.

## 🚨 Hành động ngay lập tức:

### 1. Reset Token Discord (QUAN TRỌNG NHẤT)

1. Truy cập: https://discord.com/developers/applications
2. Chọn ứng dụng của bạn
3. Vào tab **"Bot"**
4. Click **"Reset Token"** → **"Yes, do it!"**
5. Copy token mới
6. Cập nhật vào file `.env` trên máy của bạn

### 2. Xóa token khỏi Git History

Token đã được commit vào Git history, cần xóa:

```bash
# Xóa token khỏi file trong commit gần nhất
git rm --cached env.example.txt
git commit --amend -m "Remove Discord token from example file"

# Nếu đã push, cần force push (cẩn thận!)
git push --force origin main
```

**Lưu ý**: Force push sẽ ghi đè lịch sử Git. Chỉ làm nếu bạn chắc chắn!

### 3. Kiểm tra các file khác

Đảm bảo không có token trong:
- ✅ `.env` (đã có trong .gitignore)
- ✅ `env.example.txt` (đã sửa)
- ✅ `CONFIG.md` (chỉ có ví dụ)
- ✅ Các file khác

## 🛡️ Phòng ngừa trong tương lai

1. **KHÔNG BAO GIỜ** commit file `.env`
2. **KHÔNG BAO GIỜ** đặt token thật vào file mẫu
3. Luôn dùng placeholder: `your_token_here`
4. Kiểm tra `.gitignore` có chứa `.env` không
5. Sử dụng GitHub Secret Scanning để tự động phát hiện

## ✅ Checklist sau khi reset token

- [ ] Token mới đã được reset trong Discord Developer Portal
- [ ] Token mới đã được cập nhật vào file `.env` (local)
- [ ] File `.env` không được commit lên Git
- [ ] Tất cả file mẫu chỉ có placeholder, không có token thật
- [ ] Bot hoạt động bình thường với token mới

## 📞 Nếu token đã bị lạm dụng

1. Reset token ngay lập tức
2. Kiểm tra bot có hoạt động bất thường không
3. Xóa bot khỏi các server không mong muốn
4. Tạo bot mới nếu cần thiết

