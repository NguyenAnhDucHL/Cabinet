CREATE TABLE IF NOT EXISTS UserSessions (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    RefreshTokenHash TEXT NOT NULL,
    IpAddress TEXT,
    UserAgent TEXT,
    DeviceFingerprint TEXT,
    ExpiresAt TEXT NOT NULL,
    RevokedAt TEXT,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS SecurityLogs (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER,
    IpAddress TEXT,
    EventType TEXT NOT NULL,
    UserAgent TEXT,
    CreatedAt TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
