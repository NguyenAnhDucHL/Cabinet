---
trigger: always_on
description: "Quy tắc DB Schema — cấu trúc bảng SQLite và quy định thay đổi schema."
---

# TC-RULE-DATABASE-SCHEMA

Quy tắc này định nghĩa cấu trúc database chuẩn và quy trình thay đổi schema cho dự án Cabinet.

> [!IMPORTANT]
> Dự án dùng **ADO.NET thủ công**. Không có migration framework. Mọi thay đổi schema phải được thực hiện thủ công qua SQL script và ghi vào `COMMIT_LOG.md`.

## 1. Schema Bảng Chuẩn

### `Users` — Người dùng
```sql
CREATE TABLE Users (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT NOT NULL UNIQUE,
    PasswordHash TEXT NOT NULL,
    FullName TEXT,
    Email TEXT,
    PhoneNumber TEXT,
    Role TEXT NOT NULL, -- 'Admin' | 'LanhDao' | 'VanThu' | 'CanBo'
    DepartmentId INTEGER,
    SecurityStamp TEXT,
    NormalizedUserName TEXT,
    LockoutEnabled INTEGER DEFAULT 1,
    AccessFailedCount INTEGER DEFAULT 0,
    LockoutEnd TEXT,      -- ISO 8601
    FailedLoginCount INTEGER DEFAULT 0,
    LockoutUntil TEXT     -- ISO 8601
);
```

### `Rooms` — Phòng họp
```sql
CREATE TABLE Rooms (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    Capacity INTEGER,
    Location TEXT,
    Description TEXT,
    CreatedAt TEXT DEFAULT (datetime('now'))
);
```

### `Meetings` — Phiên họp
```sql
CREATE TABLE Meetings (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Title TEXT NOT NULL,
    StartTime TEXT,
    EndTime TEXT,
    RoomId INTEGER,
    Status TEXT DEFAULT 'Sắp diễn ra', -- 'Sắp diễn ra' | 'Đang diễn ra' | 'Hoàn thành' | 'Hủy'
    CreatorId INTEGER,
    Location TEXT,
    Presider TEXT,
    PreparingUnit TEXT,
    Content TEXT,
    Notes TEXT,
    OrganizingUnit TEXT,
    ExpectedAttendees INTEGER,
    ExternalParticipants TEXT,
    MeetingType TEXT,
    OnlineMeetingUrl TEXT,
    ProgramFilePaths TEXT, -- JSON Array
    InvitationFilePaths TEXT, -- JSON Array
    CreatedAt TEXT DEFAULT (datetime('now'))
);
```

### Bảng phụ khác
- `MeetingParticipants`: Thành phần tham dự (`MeetingId`, `UserId`, `AttendanceStatus`)
- `Questionnaires`: Phiếu lấy ý kiến (`Id`, `MeetingId`, `Title`, `AssignedTo`, `Deadline`, `Status`, `CreatedAt`)
- `QuestionnaireTemplates`: Mẫu phiếu lấy ý kiến (`Id`, `Name`, `Description`, `CreatedAt`, `UpdatedAt`)
- `MeetingProceedings`: Kỷ yếu phiên họp (`Id`, `Name`, `Description`, `CreatorId`, `CreatedAt`)
- `MeetingProceedingItems`: Liên kết Kỷ yếu ↔ Phiên họp (`ProceedingId`, `MeetingId`)
- `MeetingConclusions`: Kết luận phiên họp (`Id`, `MeetingId`, `FileName`, `Status`, `LastHandlerId`, `Progress`, `UpdatedAt`)
- `MeetingNotes`: Sổ tay ghi chú (`Id`, `MeetingId`, `UserId`, `Content`, `AttachmentPaths`, `CreatedAt`)
- `Departments` — Phòng ban (`Id`, `Name`, `Code`, `ParentId`)
- `PushSubscriptions` — Web Push subscriptions
- `Notifications` — Thông báo in-app
- `AuditLogs`, `LoginAuditLog` — Nhật ký hệ thống

## 2. Quy trình Thay đổi Schema

> [!WARNING]
> KHÔNG CÓ migration framework. Phải thực hiện thủ công theo đúng quy trình này.

**Khi cần thêm cột/bảng mới:**
1. Viết `ALTER TABLE` hoặc `CREATE TABLE` SQL.
2. Chạy trực tiếp trên DB dev: `sqlite3 data_dump/documents.db < migration.sql`.
3. Thêm SQL script vào file migration.
4. Cập nhật `SYSTEM_FEATURES.md` phần Database Schema.
5. Ghi vào `COMMIT_LOG.md` với SQL script đầy đủ.

**Mapping JSON columns:**
```csharp
// ✅ Serialize/Deserialize thủ công
var filePaths = JsonSerializer.Deserialize<List<string>>(
    reader.GetString(reader.GetOrdinal("ProgramFilePaths")) ?? "[]"
);

var json = JsonSerializer.Serialize(filePaths);
cmd.Parameters.AddWithValue("@ProgramFilePaths", json);
```

## 3. Quy tắc Query Chuẩn

```csharp
// ✅ Pattern chuẩn cho Repository method
public async Task<Meeting?> GetByIdAsync(int id)
{
    using var conn = new SqliteConnection(_connectionString);
    await conn.OpenAsync();
    
    using var cmd = conn.CreateCommand();
    cmd.CommandText = @"
        SELECT Id, Title, StartTime, EndTime, RoomId, Status, Presider
        FROM Meetings
        WHERE Id = @Id";
    cmd.Parameters.AddWithValue("@Id", id);
    
    using var reader = await cmd.ExecuteReaderAsync();
    if (!await reader.ReadAsync()) return null;
    
    return new Meeting
    {
        Id = reader.GetInt32(0),
        Title = reader.GetString(1),
        // ... map từng field
    };
}
```

---
**Status:** ACTIVE  
**Priority:** HIGH — Tham chiếu khi làm việc với DB