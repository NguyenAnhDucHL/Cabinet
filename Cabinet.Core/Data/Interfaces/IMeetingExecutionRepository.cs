using Cabinet.Core.Models;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace Cabinet.Core.Data.Interfaces
{
    public interface IMeetingExecutionRepository
    {
        // Speaking Requests
        Task<List<SpeakingRequest>> GetSpeakingRequestsAsync(int meetingId);
        Task<SpeakingRequest?> GetSpeakingRequestAsync(int id);
        Task<int> CreateSpeakingRequestAsync(int meetingId, int userId);
        Task<bool> UpdateSpeakingRequestStatusAsync(int id, string status);

        // Polls
        Task<List<MeetingPoll>> GetPollsAsync(int meetingId);
        Task<MeetingPoll?> GetPollAsync(int pollId);
        Task<int> CreatePollAsync(int meetingId, string title, int creatorId, List<string> options);
        Task<bool> UpdatePollStatusAsync(int pollId, string status);
        
        // Votes
        Task<bool> CastVoteAsync(int pollId, int userId, int optionId);
        Task<List<MeetingPollVote>> GetUserVotesAsync(int pollId, int userId);

        // Comments
        Task<List<MeetingComment>> GetCommentsAsync(int meetingId);
        Task<int> AddCommentAsync(int meetingId, int userId, string content);
    }
}
