# 🔧 Hướng dẫn xóa token khỏi Git History

GitHub đang chặn push vì token vẫn còn trong commit cũ. Cần xóa token khỏi Git history.

## ⚠️ QUAN TRỌNG: Reset Token trước!

**Bước đầu tiên**: Reset token trong Discord Developer Portal trước khi tiếp tục!
- https://discord.com/developers/applications
- Tab "Bot" → "Reset Token"

## Cách 1: Amend commit (Khuyến nghị)

Nếu commit chứa token là commit gần nhất:

```bash
# Xóa file khỏi staging
git rm --cached env.example.txt

# Amend commit gần nhất
git commit --amend -m "Initial commit - Remove Discord token from example files"

# Force push (ghi đè commit cũ)
git push --force origin main
```

## Cách 2: Tạo commit mới để override

Nếu không muốn force push:

```bash
# Stage các file đã sửa
git add env.example.txt CONFIG.md

# Tạo commit mới
git commit -m "Fix: Remove Discord token from example files"

# Push
git push origin main
```

**Lưu ý**: Cách này vẫn để token trong history, nhưng GitHub có thể chấp nhận nếu commit mới không có token.

## Cách 3: Rewrite Git History (Nâng cao)

Nếu muốn xóa hoàn toàn token khỏi tất cả commits:

```bash
# Cài đặt git-filter-repo (nếu chưa có)
# pip install git-filter-repo

# Xóa token khỏi toàn bộ history
git filter-repo --invert-paths --path env.example.txt --path CONFIG.md

# Force push
git push --force origin main
```

**Cảnh báo**: Cách này sẽ rewrite toàn bộ Git history. Chỉ dùng nếu bạn chắc chắn!

## Cách 4: Tạo branch mới (Đơn giản nhất)

Nếu các cách trên không work:

```bash
# Tạo branch mới từ commit trước khi có token
git checkout --orphan clean-main

# Add tất cả files (trừ .env)
git add .
git commit -m "Initial commit - Clean version"

# Xóa branch main cũ và đổi tên
git branch -D main
git branch -m main

# Force push
git push --force origin main
```

## ✅ Sau khi xóa token

1. ✅ Reset token trong Discord Developer Portal
2. ✅ Cập nhật token mới vào file `.env` (local)
3. ✅ Đảm bảo `.env` có trong `.gitignore`
4. ✅ Push lại code (không có token)
5. ✅ Test bot với token mới

## 🛡️ Phòng ngừa

- ✅ **KHÔNG BAO GIỜ** commit file `.env`
- ✅ **KHÔNG BAO GIỜ** đặt token thật vào file mẫu
- ✅ Luôn dùng placeholder: `your_token_here`
- ✅ Kiểm tra trước khi commit: `git diff`

