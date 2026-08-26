# CABINET — AGENT CONSTITUTION (AGENTS.md)

Bạn là **AI Agent** đang làm việc trong dự án **Cabinet** — Phòng họp không giấy tờ. Nhiệm vụ của bạn là thực thi các yêu cầu của Developer, tuân thủ nghiêm ngặt kiến trúc và các quy tắc dưới đây. Đọc tài liệu này **TRƯỚC KHI** thực hiện bất kỳ thay đổi nào.

---

## I. Nguyên Tắc Cốt Lõi (Core Principles)

1. **Context-First:** Luôn đọc `SYSTEM_FEATURES.md` và `COMMIT_LOG.md` ở thư mục gốc trước khi viết code mới hoặc sửa tính năng. Tuyệt đối không quét lại toàn bộ source khi thông tin đã có trong hai file này.
2. **Architecture-Integrity:** Tuyệt đối không dùng Entity Framework. Mọi truy vấn DB phải dùng ADO.NET/SqliteDataReader thô. Không tự ý đổi schema bảng mà không ghi lý do vào `COMMIT_LOG.md`.
3. **Evidence-Based:** Mọi thay đổi phải có dấu vết trong `COMMIT_LOG.md`. Không có entry = không có thay đổi hợp lệ.
4. **Response-Contract:** Mọi API endpoint **phải** trả về lớp `ApiResponse<T>` chuẩn hóa. Không được trả về object thô.
5. **Zero-Secret:** Tuyệt đối không commit API key, password, connection string, JWT secret vào Git. Dùng `.env` hoặc `appsettings.json` (không track bởi Git).
6. **Conventional-Commits:** Mọi commit message phải đúng chuẩn `<type>(<scope>): <mô tả>`. Xem Chốt Commit ở `CODE_QUALITY.md`.
7. **No-Temporary-Files:** Yêu cầu AI tự động xóa các file tạm sinh ra trong quá trình kiểm tra tài khoản, lỗi, dump,... ngay sau khi hoàn thành. Xem chi tiết tại `tc-rule-no-temporary-files.md`.
8. **AI Behavior Standard:** AI phải tuân thủ nghiêm ngặt tiêu chuẩn code tinh gọn, bằng chứng toàn diện và giao tiếp cộc lốc theo chuẩn OpenClaw. Xem chi tiết tại `tc-rule-ai-behavior.md`.

---

## II. Stack Công Nghệ (Tech Stack — Bắt buộc tuân thủ)

| Lớp | Công nghệ | Ghi chú |
|---|---|---|
| **Backend** | ASP.NET Core 10.0, C# | MVC Controllers, không Minimal API |
| **Database** | SQLite + ADO.NET | **KHÔNG Entity Framework**, dùng `SqliteDataReader` |
| **Frontend** | React 19 + Vite + Tailwind CSS v4 + shadcn/ui | `fetch` API, không Axios |
| **Auth** | JWT Bearer Token | Header `Authorization: Bearer <token>` |
| **Queue/Realtime** | RabbitMQ + SignalR | Background jobs & notifications |
| **Security** | ClamAV, BCrypt/PBKDF2, Nginx | Rate limiting: 5 req/phút cho auth |
| **Containerization** | Docker + docker-compose | File DB mount tại `/app/data/` |

---

## III. Cấu trúc Thư mục Trọng yếu

### Backend
```
Cabinet/
├── .agents/                          ← [PROTECTED] Quy tắc AI
│   ├── AGENTS.md                     ← File này
│   ├── rules/                        ← Các rule chi tiết
│   ├── skills/                       ← Kỹ năng chuyên biệt
│   └── workflows/                    ← Quy trình chuẩn
│
├── Cabinet.Api/
│   ├── Program.cs                    ← DI · JWT · Middleware pipeline
│   ├── Controllers/
│   │   ├── AuthController.cs         ← /api/auth
│   │   ├── UsersController.cs        ← /api/users
│   │   ├── AdminController.cs        ← /api/admin
│   │   ├── NotificationController.cs ← /api/notifications
│   │   └── Cabinet/                  ← /api/phonghopkhonggiayto/
│   │       ├── MeetingsController.cs
│   │       ├── RoomsController.cs
│   │       ├── QuestionnairesController.cs
│   │       ├── QuestionnaireTemplatesController.cs
│   │       ├── MeetingConclusionsController.cs
│   │       ├── MeetingProceedingsController.cs
│   │       └── MeetingNotesController.cs
│   ├── Middleware/
│   │   ├── GlobalExceptionMiddleware.cs ← Mọi lỗi → ApiResponse<T>
│   │   └── FileAccessSecurityMiddleware.cs
│   └── Security/
│       ├── HybridPasswordHasher.cs   ← BCrypt / PBKDF2 / Legacy plain-text
│       └── CustomUserStore.cs
│
├── Cabinet.Core/
│   ├── Models/
│   │   ├── ApiResponse.cs            ← ✅ Response contract bắt buộc
│   │   └── Meeting · Room · User · Questionnaire · Note · Conclusion...
│   ├── Data/Repositories/            ← 100% ADO.NET, SqliteDataReader
│   │   ├── MeetingRepository.cs
│   │   ├── UserRepository.cs
│   │   ├── RoomRepository.cs
│   │   ├── QuestionnaireRepository.cs
│   │   ├── MeetingNoteRepository.cs
│   │   ├── MeetingConclusionRepository.cs
│   │   └── MeetingProceedingRepository.cs
│   ├── Services/
│   │   ├── NotificationManager.cs · EmailService.cs · VapidService.cs
│   │   └── Security/
│   │       ├── ClamAvService.cs · FileSignatureValidator.cs
│   │       ├── ZipBombDetector.cs · MetadataStripper.cs
│   │       └── BackupService.cs
│   └── Hubs/NotificationHub.cs       ← SignalR real-time
│
├── Cabinet.Tests/
│   ├── AuthPasswordHashTests.cs
│   ├── BusinessFlowTests.cs
│   └── Cabinet/   (CabinetMeetingsTests, CabinetRoomsTests, CabinetNotesTests...)
│
├── SYSTEM_FEATURES.md                ← [ĐỌC TRƯỚC] Bộ não hệ thống
├── COMMIT_LOG.md                     ← [CẬP NHẬT SAU MỖI THAY ĐỔI]
└── CODE_QUALITY.md                   ← Tiêu chuẩn chất lượng code
```

### Frontend — Bulletproof React Feature-Driven
```
Cabinet.Api/ClientApp/src/
├── main.jsx                          ← Entry point · Router · Global Fetch Interceptor
├── shell/                            ← AppShell.jsx · Sidebar.jsx
├── pages/                            ← Login · PublicSchedule · Settings · Users
├── components/
│   ├── ui/                           ← shadcn/ui: Button·Dialog·Table·Badge·Select...
│   └── settings/                     ← GeneralTab·AuditTab·NotificationTab
├── constants/                        ← meeting.js · roles.js · document.js
├── hooks/                            ← use-mobile.js (global hooks)
├── lib/                              ← utils · signalr · push-notifications · ReportExportLogic
│
├── features/                         ← ⭐ TRUNG TÂM — Mọi logic đều ở đây
│   ├── appshell/
│   │   ├── components/AppShell/      ← TopNavigation · AppSidebar · ProfileModal
│   │   │                               ThemeModal · NotificationsPopover · VersionModal
│   │   └── constants/navigation.js   ← NAV_ITEMS · SCHEDULE_SIDEBAR
│   ├── home/
│   │   ├── components/CabinetHome/   ← MeetingCard · StatRow · SectionCard
│   │   │                               MonthPicker · EmptyState · AttendanceConfirmModal
│   │   └── hooks/useCabinetHome.js
│   ├── meetings/
│   │   ├── api/meetingApi.js
│   │   ├── components/
│   │   │   ├── MeetingCreate/        ← Step1Details · Step2Participants · Step3Contents
│   │   │   ├── MeetingDetail/        ← MeetingDetailComponents · NotebookModal
│   │   │   └── MeetingList/          ← MeetingTable · MeetingFilters · MeetingStats · MeetingPagination
│   │   └── hooks/                    ← useMeetings · useMeetingList · useMeetingCreate
│   ├── rooms/
│   │   ├── api/roomApi.js
│   │   ├── components/CabinetRooms/  ← RoomHeader · RoomTable · StatusToggle · Toast
│   │   └── hooks/useRooms.js
│   ├── questionnaires/
│   │   ├── api/questionnaireApi.js
│   │   ├── components/
│   │   │   ├── QuestionnaireList/    ← Header · Sidebar · Table · Tabs
│   │   │   └── QuestionnaireSteps.jsx ← Step1 · Step2 · Step3 · Stepper
│   │   ├── constants/questionnaire.js
│   │   └── hooks/                    ← useQuestionnaire · useQuestionnaireCreate · useQuestionnaireTemplates
│   ├── proceedings/
│   │   ├── api/proceedingApi.js
│   │   ├── components/               ← ProceedingSidebar · ProceedingDetail · ProceedingModals
│   │   └── hooks/useProceedings.js
│   ├── notes/
│   │   ├── api/noteApi.js
│   │   ├── components/               ← NoteTable · NoteFormModal
│   │   └── hooks/useNotes.js
│   ├── conclusions/
│   │   ├── api/conclusionApi.js
│   │   ├── components/               ← ConclusionTable · ConclusionFormModal
│   │   └── hooks/useConclusions.js
│   └── schedule/
│       ├── api/scheduleApi.js         ← getPublic · getLeader · getUnit
│       ├── components/               ← Header · NavBar · ScheduleBlock · LoginModal · KickedModal
│       └── hooks/useSchedule.js      ← dùng chung 3 schedule pages
│
└── cabinet/                          ← Cabinet module
    ├── CabinetAppShell.jsx           ← App shell + routing nội bộ
    ├── components/MeetingModal.jsx
    └── pages/                        ← ✅ THIN PAGES — chỉ gọi hook + render
        ├── CabinetHome.jsx
        ├── CabinetMeetings.jsx · MeetingList.jsx · MeetingDetail.jsx
        ├── CabinetMeetingCreate.jsx · MeetingProgress.jsx
        ├── CabinetRooms.jsx
        ├── CabinetQuestionnaire.jsx · CabinetQuestionnaireCreate.jsx
        ├── CabinetQuestionnaireTemplates.jsx
        ├── CabinetProceedings.jsx · CabinetNotebook.jsx · CabinetConclusions.jsx
        ├── CabinetSchedule.jsx · CabinetLeaderSchedule.jsx · CabinetUnitSchedule.jsx
```

---

## IV. Ma trận Quyền Hạn (Governance Matrix)

### ✅ Vùng Tự do (Có thể sửa đổi tự do)
- `Cabinet.Api/Controllers/` — Thêm/sửa API endpoint (bao gồm `Cabinet/`)
- `Cabinet.Api/ClientApp/src/` — React components, pages, hooks (bao gồm `cabinet/`)
- `Cabinet.Core/Services/` — Business logic, services
- `Cabinet.Core/Data/Repositories/` — ADO.NET queries
- `Cabinet.Tests/` — Unit tests
- `docs/` — Tài liệu bổ sung

### ⚠️ Vùng Tinh chỉnh (Cẩn thận khi sửa — phải ghi COMMIT_LOG)
- `Cabinet.Api/Program.cs` — DI và middleware pipeline
- `Cabinet.Api/ClientApp/package.json` — Dependencies
- `docker-compose.yml` — Config containers
- `Cabinet.Core/Models/ApiResponse.cs` — Phải giữ nguyên contract

### 🚫 Vùng Cấm (Không được tự ý sửa)
- `.agents/rules/` — Các file rule trong thư mục này
- `.agents/workflows/` — Quy trình chuẩn
- `.githooks/` — Git hooks quality gates
- `SYSTEM_FEATURES.md` — Chỉ AI cập nhật khi có tính năng mới thật sự
- `seed_db.sql` — Dữ liệu mẫu gốc

> [!CAUTION]
> Nếu lỡ tay sửa vùng cấm, hãy dùng `git checkout <file>` để khôi phục ngay.

---

## V. Quy trình Hoạt động (Operational Workflow)

### Khi nhận yêu cầu mới:
1. **Bootstrap** → Đọc `SYSTEM_FEATURES.md` và `COMMIT_LOG.md`
2. **Assess** → Kiểm tra tính năng đã tồn tại chưa, tránh duplicate
3. **Implement** → Viết code tuân thủ Tech Stack và Architecture
4. **Test** → Thêm/cập nhật Unit Tests trong `Cabinet.Tests/`
5. **Log** → Cập nhật `COMMIT_LOG.md` với đầy đủ thông tin
6. **Commit** → Dùng đúng chuẩn Conventional Commits

### Khi debug/sửa lỗi:
1. Đọc `COMMIT_LOG.md` để hiểu ngữ cảnh thay đổi gần nhất
2. Trace từ Controller → Service → Repository theo luồng ADO.NET
3. Kiểm tra `GlobalExceptionMiddleware` nếu lỗi liên quan response format
4. Ghi sự cố và bản vá vào `COMMIT_LOG.md`

---

## VI. Decision Ladder

| Tình huống | Hành động |
|---|---|
| Refactor nội bộ, thêm helper method | Tự quyết + ghi COMMIT_LOG |
| Thêm dependency mới vào package.json/csproj | Ghi lý do vào COMMIT_LOG |
| Thay đổi DB schema (thêm cột, bảng mới) | Ghi lý do + migration SQL vào COMMIT_LOG |
| Thay đổi format `ApiResponse<T>` | Phải hỏi Developer trước — ảnh hưởng toàn hệ thống |
| Thêm JWT claim mới | Phải hỏi Developer — ảnh hưởng bảo mật |

---

**Status:** ACTIVE — CABINET PROJECT RULES  
**Version:** 2.2 (Thêm cấu trúc thư mục đầy đủ BE + FE)  
**Last Updated:** 2026-08-26  
**See also:** [SYSTEM_FEATURES.md](../SYSTEM_FEATURES.md) | [COMMIT_LOG.md](../COMMIT_LOG.md) | [CODE_QUALITY.md](../CODE_QUALITY.md) | [tc-rule-ai-behavior.md](rules/tc-rule-ai-behavior.md)
 | [tc-rule-magic-strings.md](rules/tc-rule-magic-strings.md) | [tc-rule-no-temporary-files.md](rules/tc-rule-no-temporary-files.md) | [tc-rule-bloody-lessons.md](rules/tc-rule-bloody-lessons.md)
