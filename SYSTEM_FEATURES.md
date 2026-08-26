# Tài Liệu Hệ Thống Cabinet (Phòng họp không giấy tờ)

Tài liệu này chứa các thông tin thiết yếu nhất về kiến trúc, cơ sở dữ liệu, API và các luật nghiệp vụ (Business Rules). **AI phải đọc tài liệu này trước khi chỉnh sửa code để tránh phá vỡ logic cũ.**

---

## 1. Kiến Trúc Hệ Thống (Architecture)
- **Mô hình**: Client-Server phân tách hoàn toàn (Frontend build ra static file nạp vào wwwroot).
- **Frontend**: React 19, Vite, Tailwind CSS v4, shadcn/ui. Call API bằng `fetch`.
- **Backend**: ASP.NET Core 10.0 (MVC APIs), C#.
- **Database**: SQLite (Sử dụng ADO.NET/SqliteDataReader thủ công, **KHÔNG dùng Entity Framework**). File DB nằm tại `/app/data/documents.db` (trong Docker).
- **Background Jobs**: SignalR cho thông báo thời gian thực (Push/WebSockets).
- **Bảo mật**: JWT Token, ClamAV (quét file upload), BCrypt/PBKDF2 (Mật khẩu), Nginx Reverse Proxy.

---

## 2. Database Schema (Bảng Dữ Liệu)
*(Vì dùng ADO.NET thô, cấu trúc bảng cực kỳ quan trọng)*

### `Users` (Người dùng)
- `Id`, `Username`, `PasswordHash`, `FullName`, `Email`, `PhoneNumber`, `Role` (Admin, LanhDao, VanThu, CanBo), `DepartmentId`.
- Cột Identity: `SecurityStamp`, `NormalizedUserName`, `LockoutEnabled`, `AccessFailedCount`, `LockoutEnd`, `FailedLoginCount`, `LockoutUntil`.

### `Departments` (Phòng ban)
- `Id`, `Name`, `Code`, `ParentId`

### `Rooms` (Phòng họp)
- `Id`, `Name`, `Capacity`, `Location`, `Description`, `CreatedAt`

### `Meetings` (Phiên họp)
- `Id`, `Title`, `StartTime`, `EndTime`, `RoomId` (FK → Rooms), `Status` (Sắp diễn ra | Đang diễn ra | Hoàn thành | Hủy)
- `CreatorId` (FK → Users), `CreatedAt`
- **Thông tin nội dung**:
  - `Location` — Địa điểm chi tiết
  - `Presider` — Người chủ trì
  - `PreparingUnit` — Đơn vị chuẩn bị tài liệu
  - `Content` — Nội dung/chương trình họp
  - `Notes` — Ghi chú thêm
  - `OrganizingUnit` — Đơn vị tổ chức
  - `ExpectedAttendees` — Số lượng đại biểu dự kiến (INTEGER)
  - `ExternalParticipants` — Khách mời ngoài cơ quan
  - `MeetingType` — Loại phiên họp (Thường kỳ, Chuyên đề...)
  - `OnlineMeetingUrl` — Link họp trực tuyến
  - `ProgramFilePaths` — File nội dung chương trình họp (JSON array)
  - `InvitationFilePaths` — File giấy mời/phiếu mời (JSON array)

### `MeetingParticipants` (Thành phần tham dự)
- `MeetingId`, `UserId` (PRIMARY KEY kép)
- `AttendanceStatus`: `Chưa xác nhận` | `Có tham gia` | `Vắng mặt`

### `Questionnaires` (Phiếu lấy ý kiến)
- `Id`, `MeetingId`, `Title`, `AssignedTo`, `Deadline`, `Status` (`Chưa trả lời` | `Đã trả lời`), `CreatedAt`

### `MeetingProceedings` (Kỷ yếu phiên họp)
- `Id`, `Name` (NOT NULL), `Description`, `CreatorId`, `CreatedAt`

### `MeetingProceedingItems` (Liên kết Kỷ yếu ↔ Phiên họp)
- `ProceedingId`, `MeetingId` (PRIMARY KEY kép)

### `MeetingConclusions` (Kết luận sau phiên họp)
- `Id`, `MeetingId` (FK → Meetings), `FileName`, `Status`, `LastHandlerId`, `Progress` (0-100), `UpdatedAt`
- Status: `Chưa xử lý` | `Đang xử lý` | `Đã xử lý`

### `MeetingNotes` (Sổ tay ghi chú cá nhân)
- `Id`, `MeetingId` (FK → Meetings), `UserId` (FK → Users)
- `Content`, `AttachmentPaths` (JSON array of file paths), `CreatedAt`

### `DocumentFolders` (Thư mục tài liệu)
- `Id`, `Name`, `ParentId`, `Type` (DungChung | CaNhan), `CreatorId`, `CreatedAt`

### `Documents` (Tài liệu)
- `Id`, `Name`, `FileType`, `FilePath`, `DocumentType`, `IssuingAuthority`, `FolderId`, `CreatorId`, `Type` (DungChung | CaNhan), `CreatedAt`

### `UserImportantDocuments` (Tài liệu quan trọng)
- `UserId`, `DocumentId` (PRIMARY KEY kép)

### `DocumentShares` (Tài liệu được chia sẻ)
- `DocumentId`, `SharedWithUserId` (PRIMARY KEY kép), `SharedByUserId`

### Các bảng phụ khác
- `PushSubscriptions` (Đăng ký Web Push), `Notifications` (Thông báo in-app).
- `AuditLogs` & `LoginAuditLog` (Nhật ký hệ thống/đăng nhập).

---

## 3. Các API Endpoints Chính

Tất cả API yêu cầu Header `Authorization: Bearer <token>`.

### Auth (`AuthController`)
- `POST /api/auth/login`: `{ username, password }` -> Trả về JWT Token. (Rate limit: 5 lần/phút).
- `POST /api/auth/change-password`: `{ oldPassword, newPassword }`.
- `GET /api/auth/me`: Lấy thông tin user hiện tại.

### Users (`UsersController`)
- `GET /api/users`: Lấy ds user.
- `POST /api/users` / `PUT /api/users/{id}`: Thêm/Sửa user.

### Phòng họp (`RoomsController`)
- `GET /api/phonghopkhonggiayto/rooms` — Danh sách phòng họp
- `POST /api/phonghopkhonggiayto/rooms` — Tạo phòng họp mới
- `PUT /api/phonghopkhonggiayto/rooms/{id}` — Cập nhật phòng họp
- `DELETE /api/phonghopkhonggiayto/rooms/{id}` — Xóa phòng họp

### Phiên họp (`MeetingsController`)
- `GET /api/phonghopkhonggiayto/meetings/schedule` — **Tất cả** phiên họp (dùng cho admin/lãnh đạo)
- `GET /api/phonghopkhonggiayto/meetings/my-meetings` — Phiên họp mà **user hiện tại được mời**
- `GET /api/phonghopkhonggiayto/meetings/dashboard` — Thống kê tổng quan
- `GET /api/phonghopkhonggiayto/meetings/{id}` — Chi tiết 1 phiên họp
- `POST /api/phonghopkhonggiayto/meetings` — Tạo phiên họp mới
- `PUT /api/phonghopkhonggiayto/meetings/{id}` — Cập nhật phiên họp
- `PUT /api/phonghopkhonggiayto/meetings/{id}/attendance` — Cập nhật trạng thái tham dự cá nhân
- `DELETE /api/phonghopkhonggiayto/meetings/{id}` — Hủy/xóa phiên họp

### Kỷ yếu (`MeetingProceedingsController`)
- `GET /api/phonghopkhonggiayto/proceedings` — Danh sách tất cả kỷ yếu
- `GET /api/phonghopkhonggiayto/proceedings/{id}` — Chi tiết kỷ yếu
- `POST /api/phonghopkhonggiayto/proceedings` — Tạo kỷ yếu mới
- `POST /api/phonghopkhonggiayto/proceedings/{id}/meetings/{meetingId}` — Gắn thêm phiên họp
- `DELETE /api/phonghopkhonggiayto/proceedings/{id}/meetings/{meetingId}` — Gỡ phiên họp

### Kết luận (`MeetingConclusionsController`)
- `GET /api/phonghopkhonggiayto/conclusions` — Danh sách kết luận (có phân trang)
- `GET /api/phonghopkhonggiayto/conclusions/{id}` — Chi tiết kết luận
- `POST /api/phonghopkhonggiayto/conclusions` — Tạo kết luận mới
- `PUT /api/phonghopkhonggiayto/conclusions/{id}` — Cập nhật tiến độ
- `DELETE /api/phonghopkhonggiayto/conclusions/{id}` — Xóa kết luận

### Sổ tay ghi chú (`MeetingNotesController`)
- `GET /api/phonghopkhonggiayto/notes` — Ghi chú của **user hiện tại**
- `POST /api/phonghopkhonggiayto/notes` (multipart) — Tạo ghi chú đính kèm file
- `DELETE /api/phonghopkhonggiayto/notes/{id}` — Xóa ghi chú (chỉ tác giả)

---

## 4. Các Business Rules Trọng Yếu (Nghiệp vụ cốt lõi)

### 4.1. Mật khẩu & Đăng nhập
- Có cơ chế Rate Limiting (chặn IP 60s nếu spam login 5 lần).
- Có cơ chế Lockout của Identity (Khóa tài khoản 15 phút nếu sai mật khẩu 5 lần).
- Hỗ trợ nâng cấp tự động từ Plain-text sang BCrypt/PBKDF2.

### 4.2. Trạng thái tham dự họp
- Mặc định `Chưa xác nhận`.
- User chủ động xác nhận qua `PUT /meetings/{id}/attendance`. Chỉ thành viên có trong danh sách mời (`MeetingParticipants`) mới được xác nhận/tham gia.

### 4.3. Kỷ yếu
- Một kỷ yếu có thể chứa nhiều phiên họp (N-N). Một phiên họp có thể nằm trong nhiều kỷ yếu. Dùng bảng `MeetingProceedingItems` để map.

### 4.4. Ghi chú sổ tay
- Private per-user. Chỉ người tạo mới xem và xóa được ghi chú của mình.

### 4.5. Hiển thị Dashboard
- Số liệu "Tham gia / Chưa xác nhận" là lấy từ bảng `MeetingParticipants`. KHÔNG hardcode.
- Tên người chủ trì hiển thị từ trường `Presider` trong bảng `Meetings`. KHÔNG hardcode.
