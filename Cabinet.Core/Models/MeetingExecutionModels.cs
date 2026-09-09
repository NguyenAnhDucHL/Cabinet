using System;
using System.Collections.Generic;

namespace Cabinet.Core.Models
{
    public class SpeakingRequest
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime CreatedAt { get; set; }
    }

    public class MeetingPoll
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = "Closed";
        public int CreatorId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<MeetingPollOption> Options { get; set; } = new List<MeetingPollOption>();
        public int TotalVotes { get; set; } // Derived field for convenience
    }

    public class MeetingPollOption
    {
        public int Id { get; set; }
        public int PollId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int VoteCount { get; set; } // Derived field for convenience
    }

    public class MeetingPollVote
    {
        public int PollId { get; set; }
        public int UserId { get; set; }
        public int OptionId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class MeetingComment
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public int UserId { get; set; }
        public string? UserName { get; set; }
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
