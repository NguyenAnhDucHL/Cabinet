# TC-RULE-BLOODY-LESSONS

Tài liệu này tổng hợp các "bài học máu xương" (Bloody Lessons) — những lỗi ngớ ngẩn, những cái bẫy kỹ thuật, hoặc những lỗi nghiêm trọng có thể làm sập hệ thống đã gặp phải trong quá trình phát triển dự án **Cabinet**. 
**AI Agent BẮT BUỘC phải tham khảo tài liệu này để không lặp lại sai lầm.**

Mỗi khi fix một bug khó, tìm ra một lỗi do AI làm sai, hoặc cấu hình sai, hãy chủ động ghi chú lại vào đây theo định dạng:

- **[TÊN LỖI/VẤN ĐỀ]**: Mô tả ngắn gọn lỗi xảy ra.
  - **Nguyên nhân cốt lõi**: Giải thích lý do sâu xa gây ra lỗi.
  - **Bài học**: Cách khắc phục và quy tắc để không lặp lại lỗi này.

---

## 1. Hạ tầng & Docker

- **[LỖI RESTART LOOP] Ngrok crash liên tục do thiếu Authtoken:** Khi khởi chạy docker-compose, service `ngrok` sẽ crash và restart liên tục nếu biến môi trường `NGROK_AUTHTOKEN` vẫn giữ giá trị mặc định (`your_new_ngrok_authtoken_here`).
  - **Bài học:** Nếu không thực sự cần expose public URL ra ngoài, nên xóa hẳn (hoặc comment lại) service `ngrok` trong `docker-compose.yml` để tiết kiệm tài nguyên và tránh spam log lỗi. (Đã xử lý ngày 2026-08-25).

## 2. Database (SQLite & ADO.NET)

- **[LỖI 500 — no such table] Bảng DB không tồn tại nhưng code không báo lỗi rõ ràng ở Frontend:** Khi tính năng Kỷ yếu (`CabinetProceedings.jsx`) được xây dựng, bảng `MeetingProceedings` và `MeetingProceedingItems` chưa được tạo trong SQLite. Backend ném exception `SQLite Error 1: no such table` nhưng Frontend chỉ thấy dropdown trống hoặc list rỗng do `.catch(() => {})` nuốt lỗi.
  - **Nguyên nhân cốt lõi:** Dự án dùng ADO.NET thủ công, không có migration framework tự động. Mỗi khi thêm tính năng mới liên quan đến bảng DB mới, phải chạy `CREATE TABLE` bằng tay trên file DB thật (`data_dump/documents.db`).
  - **Bài học:** Trước khi viết frontend/backend cho tính năng mới, **BẮT BUỘC kiểm tra bảng DB đã tồn tại chưa** bằng lệnh `sqlite3 data_dump/documents.db ".tables"`. Nếu chưa có thì chạy migration SQL thủ công và ghi vào `COMMIT_LOG.md`. Không được giả định bảng đã tồn tại. (Đã xử lý ngày 2026-08-25).

## 3. Kiến trúc Backend (C# / ASP.NET Core)
*(Chưa có ghi chú - AI Agent thêm vào khi có sự cố)*

## 4. Frontend & UX (React / Vite)

- **[LỖI 400 BAD REQUEST] API trả về 400 do sai định dạng Payload (JSON vs FormData):** Khi Controller C# sử dụng `[FromForm] string requestJson`, ASP.NET Core MVC bắt buộc payload phải được gửi dưới dạng `multipart/form-data` hoặc `application/x-www-form-urlencoded`. Nếu Frontend (`fetch`) gửi payload dưới dạng raw JSON (dùng `JSON.stringify(body)`) mà không gói vào `FormData`, Model Binding sẽ thất bại âm thầm và tự động trả về HTTP 400.
  - **Bài học:** Nếu API endpoint có dùng `[FromForm]`, Frontend BẮT BUỘC phải dùng `new FormData()` và `fd.append('TênBiến', JSON.stringify(body))` để gửi dữ liệu. Tuyệt đối không gửi raw JSON payload cho các endpoint này. (Đã xử lý ở `MeetingModal.jsx` ngày 2026-08-25).

- **[LỖI DATA RỖNG] Global Fetch Interceptor đã unwrap `ApiResponse<T>` — code cũ dùng `json.data` bị `undefined`:** Dự án có Global Fetch Interceptor trong `main.jsx`. Interceptor này tự động bóc tách response: nếu `json.success === true` thì resolve thành `json.data` trực tiếp. Hậu quả: khi component gọi `.then(json => json.data || [])`, biến `json` lúc này ĐÃ LÀ mảng (hoặc object), không còn có thuộc tính `.data` nữa — khiến state luôn là `[]` và dropdown/list luôn trống.
  - **Nguyên nhân cốt lõi:** Interceptor hoạt động ngầm, AI Agent không nhớ và cứ viết code theo kiểu unwrap thủ công.
  - **Bài học:** Khi viết bất kỳ `fetch()` nào trong dự án này, **PHẢI dùng hàm `unwrap(json)` chuẩn** (kiểm tra `Array.isArray(json)` trước, rồi mới `json.data`). Không bao giờ trực tiếp dùng `json.data` hay `json.success` mà không kiểm tra kiểu dữ liệu trước. Nếu không có hàm unwrap thì phải tự thêm vào đầu component. (Đã xử lý ở `CabinetMeetingCreate.jsx`, `CabinetProceedings.jsx` ngày 2026-08-25).

- **[LỖI POST 400] Thiếu `Content-Type: application/json` khi POST JSON body:** Khi dùng `fetch` với `method: 'POST'` và `body: JSON.stringify(...)` mà không khai báo header `Content-Type: application/json`, ASP.NET Core không nhận diện được body và trả về 400 hoặc bind model thất bại.
  - **Bài học:** Mọi POST/PUT với JSON body phải có đủ header: `headers: { 'Content-Type': 'application/json' }`. Đây là lỗi câm — server không báo lỗi rõ, frontend thấy 400 mà không rõ nguyên nhân. (Đã xử lý ở `CabinetProceedings.jsx` ngày 2026-08-25).

- **[LỖI 401 — DROPDOWN TRỐNG] Global Fetch Interceptor KHÔNG inject JWT token vào request:** Interceptor trong `main.jsx` chỉ xử lý *response* (unwrap ApiResponse), nhưng KHÔNG tự động thêm `Authorization: Bearer <token>` vào *request*. Mọi component không truyền header thủ công sẽ gọi API → nhận 401 → `.catch(() => {})` nuốt lỗi → state luôn `[]` → dropdown/list trống. Lỗi này **cực kỳ khó debug** vì không có log rõ ràng.
  - **Nguyên nhân cốt lõi:** Design ban đầu dựa vào HttpOnly Cookie cho auth, nhưng một số endpoint yêu cầu Bearer token. Interceptor không đồng nhất được 2 luồng này.
  - **Bài học:** **ĐÃ FIX** — Interceptor trong `main.jsx` hiện tại tự động inject `Authorization: Bearer <token>` cho mọi request tới `/api/`. Nếu gặp dropdown trống bí ẩn, kiểm tra ngay: (1) `curl` thử endpoint → xem HTTP status, (2) Nếu 401 → vấn đề auth. Không được để `.catch(() => {})` im lặng khi debug. (Đã xử lý ngày 2026-08-25).

## 5. Xử lý File & Hệ thống
*(Chưa có ghi chú - AI Agent thêm vào khi có sự cố)*

---
**Status:** ACTIVE  
**Priority:** CAUTION — Những bài học phải ghi nhớ để tránh "đổ máu" lần 2.
