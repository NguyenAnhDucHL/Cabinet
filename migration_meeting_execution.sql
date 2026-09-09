-- migration_meeting_execution.sql

-- 1. Speaking Requests
CREATE TABLE IF NOT EXISTS MeetingSpeakingRequests (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    MeetingId INTEGER NOT NULL,
    UserId INTEGER NOT NULL,
    Status TEXT DEFAULT 'Pending', -- Pending, Approved, Rejected, Finished
    CreatedAt TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (MeetingId) REFERENCES Meetings(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 2. Meeting Polls
CREATE TABLE IF NOT EXISTS MeetingPolls (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    MeetingId INTEGER NOT NULL,
    Title TEXT NOT NULL,
    Status TEXT DEFAULT 'Closed', -- Open, Closed
    CreatorId INTEGER NOT NULL,
    CreatedAt TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (MeetingId) REFERENCES Meetings(Id) ON DELETE CASCADE,
    FOREIGN KEY (CreatorId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- 3. Meeting Poll Options
CREATE TABLE IF NOT EXISTS MeetingPollOptions (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    PollId INTEGER NOT NULL,
    Content TEXT NOT NULL,
    FOREIGN KEY (PollId) REFERENCES MeetingPolls(Id) ON DELETE CASCADE
);

-- 4. Meeting Poll Votes
CREATE TABLE IF NOT EXISTS MeetingPollVotes (
    PollId INTEGER NOT NULL,
    UserId INTEGER NOT NULL,
    OptionId INTEGER NOT NULL,
    CreatedAt TEXT DEFAULT (datetime('now', 'localtime')),
    PRIMARY KEY (PollId, UserId),
    FOREIGN KEY (PollId) REFERENCES MeetingPolls(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
    FOREIGN KEY (OptionId) REFERENCES MeetingPollOptions(Id) ON DELETE CASCADE
);

-- 5. Meeting Comments
CREATE TABLE IF NOT EXISTS MeetingComments (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    MeetingId INTEGER NOT NULL,
    UserId INTEGER NOT NULL,
    Content TEXT NOT NULL,
    CreatedAt TEXT DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (MeetingId) REFERENCES Meetings(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);
