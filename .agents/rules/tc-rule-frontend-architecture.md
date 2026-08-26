---
trigger: always_on
description: "Quy tắc kiến trúc Frontend React — Bulletproof React Feature-Driven, Global Fetch Interceptor, Tailwind v4, shadcn/ui."
---

# TC-RULE-FRONTEND-ARCHITECTURE

Quy tắc này định nghĩa các ràng buộc bắt buộc cho layer Frontend React của Cabinet.

---

## 1. Kiến trúc Thư mục — Bulletproof React (Feature-Driven)

> [!IMPORTANT]
> Dự án áp dụng **Bulletproof React** (Feature-Driven Architecture). Mọi code mới phải tuân theo cấu trúc này. TUYỆT ĐỐI không tạo file component/hook trực tiếp ở `src/` root hay `src/cabinet/`.

### Cấu trúc chuẩn

```
Cabinet.Api/ClientApp/src/
├── components/                  ← Shared UI (dùng toàn app, không thuộc feature nào)
│   ├── ui/                      ← shadcn/ui components (Button, Dialog, Badge, Table...)
│   └── settings/                ← Settings tabs dùng chung
├── constants/                   ← App-wide constants (roles, meeting status...)
├── features/                    ← ✅ TRUNG TÂM — Mọi tính năng đều nằm ở đây
│   ├── appshell/                ← Layout, navigation, sidebar
│   │   ├── components/AppShell/ ← TopNavigation, AppSidebar, ProfileModal, ThemeModal...
│   │   └── constants/           ← navigation.js (NAV_ITEMS, SCHEDULE_SIDEBAR)
│   ├── home/                    ← Dashboard
│   │   └── components/CabinetHome/ ← MeetingCard, StatRow, AttendanceConfirmModal...
│   ├── meetings/                ← Quản lý phiên họp
│   │   ├── api/                 ← meetingApi.js
│   │   ├── components/
│   │   │   ├── MeetingCreate/   ← Step1Details, Step2Participants, Step3Contents
│   │   │   ├── MeetingDetail/   ← MeetingDetailComponents, NotebookModal
│   │   │   └── MeetingList/     ← MeetingTable, MeetingFilters, MeetingStats, MeetingPagination
│   │   └── hooks/               ← useMeetings, useMeetingList, useMeetingCreate
│   ├── rooms/                   ← Quản lý phòng họp
│   │   ├── api/                 ← roomApi.js
│   │   ├── components/          ← RoomModal, DeleteConfirm
│   │   │   └── CabinetRooms/    ← RoomHeader, RoomTable, StatusToggle, Toast
│   │   └── hooks/               ← useRooms
│   ├── questionnaires/          ← Phiếu lấy ý kiến
│   │   ├── api/                 ← questionnaireApi.js
│   │   ├── components/
│   │   │   └── QuestionnaireList/ ← QuestionnaireHeader, QuestionnaireSidebar, QuestionnaireTable, QuestionnaireTabs
│   │   ├── constants/           ← questionnaire.js (TABS, STATUS_BADGE)
│   │   └── hooks/               ← useQuestionnaire, useQuestionnaireCreate, useQuestionnaireTemplates
│   ├── proceedings/             ← Kỷ yếu phiên họp
│   │   ├── api/                 ← proceedingApi.js
│   │   ├── components/          ← ProceedingSidebar, ProceedingDetail, ProceedingModals
│   │   └── hooks/               ← useProceedings
│   ├── notes/                   ← Sổ tay ghi chú
│   │   ├── api/                 ← noteApi.js
│   │   ├── components/          ← NoteTable, NoteFormModal
│   │   └── hooks/               ← useNotes
│   ├── conclusions/             ← Kết luận sau phiên họp
│   │   ├── api/                 ← conclusionApi.js
│   │   ├── components/          ← ConclusionTable, ConclusionFormModal
│   │   └── hooks/               ← useConclusions
│   └── schedule/                ← Lịch họp công khai
│       ├── api/                 ← scheduleApi.js
│       └── components/          ← Header, NavBar, ScheduleBlock, LoginModal, KickedModal
├── hooks/                       ← Global hooks (dùng nhiều features)
├── lib/                         ← Utilities (utils, signalr, push-notifications, ReportExportLogic)
├── pages/                       ← Non-feature pages (Login, PublicSchedule, Settings, Users)
│   └── (thin wrappers — chỉ render feature components)
├── shell/                       ← App layout (AppShell.jsx, Sidebar.jsx)
├── cabinet/                     ← Cabinet module
│   ├── CabinetAppShell.jsx      ← App shell của toàn bộ Cabinet module
│   └── pages/                   ← Cabinet pages (thin — chỉ gọi hook + render components)
│       ├── CabinetHome.jsx
│       ├── CabinetMeetings.jsx
│       ├── MeetingList.jsx
│       ├── MeetingDetail.jsx
│       ├── CabinetRooms.jsx
│       └── ...
└── main.jsx                     ← Global Fetch Interceptor, Router, Provider
```

### Quy tắc đặt file

| Loại code | Vị trí đúng | Ví dụ |
|---|---|---|
| API calls cho 1 feature | `features/<name>/api/` | `meetingApi.js` |
| Hook chỉ dùng trong 1 feature | `features/<name>/hooks/` | `useMeetings.js` |
| Component chỉ dùng trong 1 feature | `features/<name>/components/` | `NoteTable.jsx` |
| Page entry point (Cabinet module) | `cabinet/pages/` | `CabinetHome.jsx` |
| Component dùng ở nhiều features | `components/` | `ErrorState.jsx` |
| Hook dùng ở nhiều features | `hooks/` | `use-mobile.js` |
| Layout toàn app | `shell/` | `AppShell.jsx`, `Sidebar.jsx` |
| shadcn/ui primitives | `components/ui/` | `Button`, `Dialog`, `Table` |

### ❌ KHÔNG làm

```
src/cabinet/features/                ← ĐÃ XÓA — dùng src/features/ thay thế
src/components/MeetingModal.jsx      ← Sai: thuộc features/meetings/components/
src/hooks/useMeetings.js             ← Sai: thuộc features/meetings/hooks/
features/meetings/MeetingList.jsx    ← Sai: phải trong components/ hoặc routes/
```

---

## 2. Quy tắc Kích thước Component (Lines of Code)

> [!WARNING]
> Vi phạm giới hạn dòng = phải refactor ngay trước khi commit.

| Ngưỡng | Hành động |
|---|---|
| ≤ 250 dòng | ✅ Lý tưởng |
| 251–400 dòng | 🟡 Cân nhắc tách |
| > 400 dòng | 🔴 BẮT BUỘC phải tách |
| > 500 dòng | 🚨 KHÔNG CHẤP NHẬN — tách ngay |

**Pages trong `cabinet/pages/` phải là "thin pages"**: chỉ gọi hook + truyền props xuống feature components. Không được chứa inline UI phức tạp.

---

## 3. Chiến lược Tách Component (Container–Presentational Pattern)

### Bước 1: Tách Logic → Custom Hook (trong `features/<name>/hooks/`)

```js
// ✅ features/meetings/hooks/useMeetings.js
export function useMeetings() {
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    meetingApi.getAll().then(r => setMeetings(r.data || []))
      .finally(() => setLoading(false))
  }, [])

  return { meetings, loading }
}
```

### Bước 2: Page chỉ còn thin wrapper

```jsx
// ✅ cabinet/pages/MeetingList.jsx — chỉ gọi hook + render components
export function MeetingList() {
  const { meetings, loading, ... } = useMeetingList()
  return (
    <>
      <MeetingStats ... />
      <MeetingTable meetings={meetings} loading={loading} ... />
      <MeetingPagination ... />
    </>
  )
}
```

### Bước 3: Tách Modal/Table/Form thành components riêng

```
features/meetings/components/
  MeetingCreate/
    Step1Details.jsx
    Step2Participants.jsx
    Step3Contents.jsx
  MeetingList/
    MeetingTable.jsx
    MeetingFilters.jsx
    MeetingStats.jsx
    MeetingPagination.jsx
  MeetingDetail/
    MeetingDetailComponents.jsx
    NotebookModal.jsx
```

---

## 4. HTTP Client — Chỉ dùng `fetch` Native

> [!IMPORTANT]
> Dự án này KHÔNG dùng Axios. Mọi API call phải dùng `fetch` native với Global Fetch Interceptor đã được thiết lập trong `main.jsx`.

Interceptor xử lý tự động:
- **Token injection**: Tự động thêm `Authorization: Bearer <token>` header.
- **Error handling**: Tự động xử lý lỗi 401 (redirect login), 403, 500.

```js
// ✅ ĐÚNG — interceptor lo hết
const data = await fetch('/api/phonghopkhonggiayto/meetings').then(r => r.json())

// ✅ POST với FormData
const result = await fetch('/api/phonghopkhonggiayto/meetings', {
  method: 'POST',
  body: formData,
}).then(r => r.json())

// ❌ SAI — không tự thêm header thủ công
fetch('/api/users', { headers: { Authorization: `Bearer ${token}` } })

// ❌ SAI — không dùng Axios
import axios from 'axios'
```

---

## 5. Styling — Tailwind CSS v4 + shadcn/ui

- Dùng **Tailwind CSS v4** — cú pháp v4 (không có `tailwind.config.js`).
- Dùng **shadcn/ui** components: `Button`, `Dialog`, `Table`, `Badge`, `Select`, `Input`...
- Màu accent của dự án: `#c8102e` (đỏ Cabinet) — dùng trực tiếp hoặc qua CSS var.
- Mobile-first: `sm:`, `md:`, `lg:` breakpoints.
- **Không** viết CSS custom inline style khi Tailwind đã có sẵn.

---

## 6. State Management

- Dùng **React hooks** (`useState`, `useEffect`, `useContext`, `useCallback`) — không Redux/Zustand.
- Auth state: `localStorage` (token) + đọc từ JWT claims.
- Không thêm thư viện state mới mà không hỏi Developer.

---

## 7. Code Quality (ESLint enforced — pre-commit hook)

| Rule | Mô tả |
|---|---|
| `===` bắt buộc | Không dùng `==` cho so sánh |
| No `var` | Chỉ `const` và `let` |
| No `eval()` | Cấm tuyệt đối |
| No `console.log` | Xóa trước commit |
| No `debugger` | Xóa trước commit |
| React `key` prop | Bắt buộc trong list render |
| Rules of Hooks | Không gọi hook trong điều kiện/vòng lặp |

---

## 8. Coding Convention: Magic Strings & Constants

```js
// ✅ ĐÚNG: Dùng Constants object
export const CONCLUSION_STATUS = {
  CHUA_XU_LY: 'Chưa xử lý',
  DANG_XU_LY: 'Đang xử lý',
  DA_XU_LY: 'Đã xử lý',
}

// ✅ ĐÚNG: Dùng trong switch/if
switch (status) {
  case CONCLUSION_STATUS.DA_XU_LY:
    return <Badge>Đã xử lý</Badge>
}

// ❌ SAI: Hardcode string trong logic
if (status === 'Đã xử lý') { ... }
```

Constants scope:
- **Global** → `src/constants/` (meeting.js, roles.js, document.js)
- **Feature-specific** → `features/<name>/constants/` (questionnaire.js)

---

## 9. Build & Dev Server

```bash
# Dev (trong Cabinet.Api/ClientApp/)
npm run dev

# Kiểm tra ESLint
npx eslint src/

# Kiểm tra Prettier
npx prettier --check .

# Tự động fix
npx prettier --write . && npx eslint src/ --fix

# Production build (chỉ khi deploy)
npm run build  # Output → ../wwwroot/
```

---
**Status:** ACTIVE  
**Priority:** LEVEL 1 — Ràng buộc kiến trúc cứng  
**Last Updated:** 2026-08-26  
**Architecture Reference:** Bulletproof React (https://github.com/alan2207/bulletproof-react)  
**See also:** [AGENTS.md](../AGENTS.md) | [tc-rule-quality-gate.md](tc-rule-quality-gate.md)