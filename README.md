# 📄 Cabinet - Phòng Họp Không Giấy Tờ

Hệ thống quản lý, giám sát và tổ chức phòng họp không giấy tờ thời gian thực dành cho cơ quan hành chính. Giúp số hóa toàn bộ quy trình họp, từ khâu lên lịch, chuẩn bị tài liệu, lấy ý kiến đến ban hành kết luận.

## 🌟 Tính năng chính

- **Quản lý Lịch Họp & Phòng Họp**: Trực quan hóa lịch công tác, lịch họp đơn vị và lịch lãnh đạo. Quản lý danh sách phòng họp và sức chứa.
- **Tài liệu & Kỷ yếu Số**: Quản lý tài liệu, chương trình họp, giấy mời. Tổng hợp các phiên họp theo chuyên đề (Kỷ yếu).
- **Lấy ý kiến & Biểu quyết**: Gửi phiếu lấy ý kiến trước hoặc trong phiên họp. Theo dõi tiến độ trả lời thời gian thực.
- **Sổ tay ghi chú cá nhân**: Cho phép đại biểu ghi chú riêng tư, đính kèm file trong từng phiên họp.
- **Kết luận & Theo dõi tiến độ**: Ban hành kết luận sau phiên họp và theo dõi tiến độ xử lý công việc.
- **Quản lý Nhân sự (CRUD)**: Quản lý chi tiết hồ sơ cán bộ bao gồm Họ tên, Email, Số điện thoại và sơ đồ Phòng ban.
- **Bảo mật RBAC**: Phân quyền chặt chẽ các vai trò (Admin, Lãnh đạo, Văn thư, Cán bộ).

## 🛠️ Hướng dẫn Cài đặt Hệ thống (Dành cho Admin)

### Bước 1: Chuẩn bị môi trường

- Cài đặt **Docker Desktop**.

### Bước 2: Khởi chạy Server

1. Mở terminal tại thư mục dự án.
2. Chạy lệnh:
   ```powershell
   docker-compose up -d --build
   ```
3. Hệ thống sẽ khởi chạy Backend, Nginx Proxy và Ngrok.

### Bước 3: Cấu hình Biến môi trường (.env)

Tạo file `.env` tại thư mục gốc với các thông số sau để đảm bảo tính ổn định và bảo mật:

```ini
# Bảo mật Token (Tối thiểu 32 ký tự)
JWT_SECRET=Cabinet_Secure_Key_2026_ReplaceMe

# Thông tin Push Notification (HTTPS là bắt buộc)
VAPID_SUBJECT=mailto:admin@yourdomain.com

# Ngrok (Nếu truy cập từ xa)
NGROK_AUTHTOKEN=your_ngrok_token
NGROK_DOMAIN=your_custom_domain.ngrok-free.app
```

> [!IMPORTANT]
> **Yêu cầu HTTPS:** Thông báo đẩy (Web Push) chỉ hoạt động trên môi trường **HTTPS**. Nếu chạy local, hãy dùng `localhost` hoặc link Ngrok `https://`.

---

## 💻 Phát triển Frontend Vite React

Frontend nằm trong `Cabinet.Api/ClientApp` và build ra `Cabinet.Api/wwwroot` để backend .NET phục vụ static files.
Giao diện sử dụng **React 19**, **Tailwind CSS v4** và **shadcn/ui**.

### Hot reload khi phát triển UI

Cách thuận tiện nhất là chạy backend bằng Docker, còn frontend chạy bằng Vite dev server trên máy host:

```powershell
docker-compose up -d
cd Cabinet.Api/ClientApp
npm run dev
```

Mở frontend dev tại:

```text
http://localhost:5173/login.html
```

Backend Docker expose `http://localhost:59607`, và Vite đã proxy các route API về backend này.

1. Chạy backend API thủ công (nếu không dùng Docker):
   ```powershell
   dotnet run --project Cabinet.Api/Cabinet.Api.csproj
   ```
2. Cài dependencies frontend:
   ```powershell
   cd Cabinet.Api/ClientApp
   npm install
   ```
3. Chạy Vite dev server:
   ```powershell
   npm run dev
   ```

Build production frontend thủ công:

```powershell
cd Cabinet.Api/ClientApp
npm run build
```

---

## 🔑 Tài khoản Mặc định

Liên hệ quản trị viên hệ thống để nhận thông tin đăng nhập ban đầu.
> **Bắt buộc thay đổi mật khẩu ngay sau lần đăng nhập đầu tiên.**

- **Địa chỉ truy cập nội bộ**: [https://localhost](https://localhost) hoặc IP của máy chủ.
- **Địa chỉ truy cập từ xa**: Sử dụng link do Ngrok cung cấp (kiểm tra trong Docker logs của container ngrok).

---

## 📈 Quy trình làm việc

1. **Văn thư / Đơn vị tổ chức**: Tạo phiên họp, chọn phòng họp, đính kèm giấy mời và chương trình. Mời đại biểu tham dự.
2. **Lãnh đạo**: Xem lịch công tác lãnh đạo, theo dõi danh sách đại biểu đã xác nhận tham dự. Chủ trì cuộc họp.
3. **Đại biểu (Cán bộ)**: Nhận thông báo mời họp. Xác nhận tham gia. Đọc tài liệu trước, trả lời phiếu ý kiến (nếu có). Ghi chú vào Sổ tay cá nhân.
4. **Văn thư**: Ban hành kết luận sau phiên họp, cập nhật tiến độ thực hiện kết luận để các bên theo dõi.

---

## 🛡️ Tính năng Hardening (Vận hành ổn định)

Hệ thống đã được gia cố (hardened) để đạt tiêu chuẩn vận hành thực tế:

- **Database Concurrency (WAL Mode):** Cho phép truy cập đồng thời trơn tru.
- **Silent Re-subscription:** Tự động sửa lỗi và đăng ký lại thông báo đẩy ngầm khi phát hiện thay đổi cấu hình máy chủ.
- **Rate Limiting:** Bảo vệ API khỏi các cuộc tấn công spam và quá tải (Giới hạn 50 req/10s).
- **Health Check Banner:** Cảnh báo trực quan ngay trên giao diện nếu trình duyệt đang chặn quyền thông báo.
