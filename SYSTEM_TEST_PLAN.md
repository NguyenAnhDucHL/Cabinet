# KỊCH BẢN KIỂM THỬ HỆ THỐNG CABINET (TEST PLAN)

Tài liệu này cung cấp kịch bản kiểm thử toàn diện (End-to-End) cho hệ thống **Cabinet - Phòng họp không giấy tờ**, bao phủ nhiều chức năng nghiệp vụ, tương tác thời gian thực và kiểm thử phân quyền nhiều vai trò.

---

## 1. CHUẨN BỊ MÔI TRƯỜNG & TÀI KHOẢN (SETUP)

Để chạy kịch bản này, cần đảm bảo DB đã được seed các tài khoản sau (hoặc Admin tự tạo ở Kịch bản 1):

| Vai trò (Role) | Username (Gợi ý) | Password mặc định | Mô tả |
|---|---|---|---|
| **Admin** | `admin_test` | `123456aA@` | Quản trị viên hệ thống |
| **Văn Thư** | `vanthu_test` | `123456aA@` | Người lên lịch, chuẩn bị tài liệu |
| **Lãnh Đạo** | `lanhdao_test` | `123456aA@` | Chủ tọa phiên họp, ra quyết định |
| **Cán Bộ 1** | `canbo_1` | `123456aA@` | Đại biểu tham gia |
| **Cán Bộ 2** | `canbo_2` | `123456aA@` | Đại biểu tham gia |

---

## 2. KỊCH BẢN 1: QUẢN TRỊ HỆ THỐNG VÀ BẢO MẬT (ADMIN)

**Mục tiêu:** Kiểm tra quyền Admin, quản lý danh mục và cơ chế bảo mật (Rate limiting, khóa tài khoản).

- [ ] **Test 1.1 - Đăng nhập & Rate Limit:**
  - Nhập sai mật khẩu của `admin_test` 5 lần liên tiếp.
  - **Kỳ vọng:** Hệ thống báo lỗi và khóa tài khoản tạm thời (Lockout). Đăng nhập lại bằng tài khoản khác.
- [ ] **Test 1.2 - Quản lý Phòng Ban:**
  - Admin tạo phòng ban mới: "Phòng Kế Hoạch Tổng Hợp".
- [ ] **Test 1.3 - Quản lý Phòng Họp (Rooms):**
  - Admin tạo phòng họp: "Phòng Họp A" (Sức chứa: 50 người, Vị trí: Tầng 2).
  - Admin chỉnh sửa thông tin phòng họp.
- [ ] **Test 1.4 - Quản lý Người dùng (Users):**
  - Admin tạo các tài khoản `vanthu_test`, `lanhdao_test`, `canbo_1`, `canbo_2` và gán đúng Role.
  - **Kỳ vọng:** Mật khẩu được mã hóa BCrypt/PBKDF2 trong DB (không lưu plain-text).

---

## 3. KỊCH BẢN 2: CHUẨN BỊ PHIÊN HỌP (VĂN THƯ)

**Mục tiêu:** Kiểm tra luồng tạo phiên họp, phân công thành phần và chuẩn bị tài liệu số.

- [ ] **Test 2.1 - Tạo phiên họp mới:**
  - `vanthu_test` đăng nhập.
  - Tạo phiên họp: "Họp Giao Ban Tháng 9".
  - Thời gian: Sắp diễn ra (VD: Ngày mai). Chọn "Phòng Họp A".
- [ ] **Test 2.2 - Thêm thành phần tham dự:**
  - Mời `lanhdao_test` (Vai trò: Chủ tọa).
  - Mời `canbo_1` và `canbo_2` (Vai trò: Đại biểu).
- [ ] **Test 2.3 - Quản lý Tài liệu (Files):**
  - Upload file tài liệu (.pdf, .docx) vào mục Tài liệu họp.
  - **Bảo mật:** Thử upload 1 file `.exe` hoặc file giả mạo đuôi.
  - **Kỳ vọng:** Hệ thống (ClamAvService/FileSignatureValidator) từ chối file độc hại.
- [ ] **Test 2.4 - Chuẩn bị Phiếu lấy ý kiến (Questionnaires):**
  - Chọn 1 mẫu phiếu (QuestionnaireTemplates) hoặc tạo mới: "Biểu quyết thông qua kế hoạch".
  - Gán thời hạn biểu quyết, gắn vào phiên họp.

---

## 4. KỊCH BẢN 3: TƯƠNG TÁC TRƯỚC VÀ TRONG PHIÊN HỌP (ĐA NGƯỜI DÙNG)

**Mục tiêu:** Kiểm tra luồng điểm danh, realtime notifications, sổ tay ghi chú và biểu quyết. Nên mở nhiều tab/trình duyệt ẩn danh để test cùng lúc.

- [ ] **Test 3.1 - Thông báo Real-time (SignalR):**
  - Khi Văn thư chốt phiên họp ở Kịch bản 2, các tài khoản `lanhdao_test`, `canbo_1`, `canbo_2` đang online phải nhận được thông báo đẩy (Push/Toast notification) ngay lập tức.
- [ ] **Test 3.2 - Lịch công tác & Điểm danh:**
  - `canbo_1` đăng nhập, kiểm tra Lịch (Schedule) thấy phiên họp.
  - `canbo_1` bấm "Xác nhận tham gia" (AttendanceStatus -> Tham gia).
  - `canbo_2` bấm "Báo vắng mặt" kèm lý do (AttendanceStatus -> Vắng mặt).
- [ ] **Test 3.3 - Bắt đầu phiên họp:**
  - Đến giờ họp, `lanhdao_test` (Chủ tọa) bấm nút **"Bắt đầu họp"**.
  - **Kỳ vọng:** Trạng thái phiên họp chuyển sang `Đang diễn ra`. Các chức năng trong phòng họp được mở khóa.
- [ ] **Test 3.4 - Sổ tay ghi chú cá nhân (Meeting Notes):**
  - `canbo_1` mở xem tài liệu PDF trực tuyến trên hệ thống.
  - `canbo_1` tạo ghi chú cá nhân mới trong Sổ tay của phiên họp này.
- [ ] **Test 3.5 - Tham gia Biểu quyết (Questionnaires):**
  - Chủ tọa `lanhdao_test` phát lệnh biểu quyết.
  - `canbo_1` mở Phiếu lấy ý kiến, chọn "Đồng ý" và Submit.
  - Mở màn hình của Chủ tọa/Văn thư để xem kết quả biểu quyết được cập nhật (nếu có realtime thì càng tốt).

---

## 5. KỊCH BẢN 4: KẾT THÚC VÀ HẬU PHIÊN HỌP (VĂN THƯ / LÃNH ĐẠO)

**Mục tiêu:** Đóng phiên họp, ban hành kết luận và lưu trữ kỷ yếu.

- [ ] **Test 4.1 - Kết thúc phiên họp:**
  - `lanhdao_test` (Chủ tọa) hoặc `vanthu_test` bấm **"Kết thúc họp"**.
  - **Kỳ vọng:** Trạng thái chuyển sang `Hoàn thành`. Không thể điểm danh hay sửa phiếu biểu quyết nữa.
- [ ] **Test 4.2 - Ban hành Kết luận (Meeting Conclusions):**
  - `vanthu_test` cập nhật file "Thông báo Kết luận giao ban.pdf".
  - Giao việc/gán trạng thái: "Chưa xử lý" -> "Đang xử lý".
- [ ] **Test 4.3 - Lưu trữ Kỷ yếu (Meeting Proceedings):**
  - `vanthu_test` tổng hợp các phiên họp tháng 9 vào một bộ Kỷ yếu chung (Proceeding).
  - Xuất báo cáo danh sách họp.
- [ ] **Test 4.4 - Giao diện Lịch (Public Schedule):**
  - Vào trang Lịch Đơn vị (Unit Schedule) không cần đăng nhập (nếu hệ thống hỗ trợ public view).
  - **Kỳ vọng:** Các cuộc họp không có tính bảo mật cao (hoặc đã duyệt công khai) được hiển thị trên lịch tuần.

---

## 6. CHECKLIST KỸ THUẬT VÀ CHẤT LƯỢNG (DÀNH CHO DEV/QA)

- [ ] **API Response Contract:** Mọi request FE gửi lên đều nhận về đúng chuẩn `ApiResponse<T>`.
- [ ] **ADO.NET / Database:** Không có dấu hiệu Exception liên quan đến locked database do SQLite Transaction bất đồng bộ gây ra.
- [ ] **Token Expiration:** Chờ 1 khoảng thời gian cho JWT hết hạn, thao tác tiếp trên màn hình xem Fetch Interceptor có tự động đá văng ra màn Login không.
- [ ] **Responsive Design:** Thu nhỏ cửa sổ trình duyệt xuống kích thước Mobile (375px). Bố cục lưới, Bảng (Table), và Sidebar phải tự gập gọn hợp lý.
- [ ] **UI/UX Aesthetics:** Các Modal, Button khi hover có animation mượt mà; hiển thị Toast Notification khi thành công/thất bại (màu đỏ chủ đạo `#c8102e`).

---
*Ghi chú: Nếu phát sinh lỗi trong quá trình test, vui lòng kiểm tra Console (F12) trên trình duyệt hoặc xem file `GlobalExceptionMiddleware` trả về thông báo lỗi gì để tiếp tục debug.*
