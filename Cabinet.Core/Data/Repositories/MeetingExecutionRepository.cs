using Cabinet.Core.Data.Interfaces;
using Cabinet.Core.Models;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cabinet.Core.Data.Repositories
{
    public class MeetingExecutionRepository : IMeetingExecutionRepository
    {
        private readonly string _connectionString;

        public MeetingExecutionRepository(IConfiguration configuration)
        {
            var dbPath = configuration["DB_PATH"] ?? "/app/data/documents.db";
            _connectionString = $"Data Source={dbPath};Cache=Shared;";
        }

        public async Task<List<SpeakingRequest>> GetSpeakingRequestsAsync(int meetingId)
        {
            var results = new List<SpeakingRequest>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT s.Id, s.MeetingId, s.UserId, u.FullName as UserName, s.Status, s.CreatedAt
                FROM MeetingSpeakingRequests s
                JOIN Users u ON s.UserId = u.Id
                WHERE s.MeetingId = @MeetingId
                ORDER BY s.CreatedAt ASC";
            cmd.Parameters.AddWithValue("@MeetingId", meetingId);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                results.Add(new SpeakingRequest
                {
                    Id = reader.GetInt32(0),
                    MeetingId = reader.GetInt32(1),
                    UserId = reader.GetInt32(2),
                    UserName = reader.IsDBNull(3) ? "Unknown" : reader.GetString(3),
                    Status = reader.GetString(4),
                    CreatedAt = reader.GetDateTime(5)
                });
            }
            return results;
        }

        public async Task<SpeakingRequest?> GetSpeakingRequestAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT s.Id, s.MeetingId, s.UserId, u.FullName as UserName, s.Status, s.CreatedAt
                FROM MeetingSpeakingRequests s
                JOIN Users u ON s.UserId = u.Id
                WHERE s.Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new SpeakingRequest
                {
                    Id = reader.GetInt32(0),
                    MeetingId = reader.GetInt32(1),
                    UserId = reader.GetInt32(2),
                    UserName = reader.IsDBNull(3) ? "Unknown" : reader.GetString(3),
                    Status = reader.GetString(4),
                    CreatedAt = reader.GetDateTime(5)
                };
            }
            return null;
        }

        public async Task<int> CreateSpeakingRequestAsync(int meetingId, int userId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            
            // Check if already pending/approved
            cmd.CommandText = "SELECT COUNT(1) FROM MeetingSpeakingRequests WHERE MeetingId = @MeetingId AND UserId = @UserId AND Status IN ('Pending', 'Approved')";
            cmd.Parameters.AddWithValue("@MeetingId", meetingId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            
            var exists = Convert.ToInt64(await cmd.ExecuteScalarAsync()) > 0;
            if (exists) return 0; // Already requested

            cmd.CommandText = @"
                INSERT INTO MeetingSpeakingRequests (MeetingId, UserId, Status)
                VALUES (@MeetingId, @UserId, 'Pending');
                SELECT last_insert_rowid();";
            
            return Convert.ToInt32(await cmd.ExecuteScalarAsync());
        }

        public async Task<bool> UpdateSpeakingRequestStatusAsync(int id, string status)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE MeetingSpeakingRequests SET Status = @Status WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Status", status);
            cmd.Parameters.AddWithValue("@Id", id);
            return (await cmd.ExecuteNonQueryAsync()) > 0;
        }

        public async Task<List<MeetingPoll>> GetPollsAsync(int meetingId)
        {
            var polls = new List<MeetingPoll>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            
            // Fetch Polls
            cmd.CommandText = @"
                SELECT p.Id, p.MeetingId, p.Title, p.Status, p.CreatorId, p.CreatedAt,
                       (SELECT COUNT(1) FROM MeetingPollVotes v WHERE v.PollId = p.Id) as TotalVotes
                FROM MeetingPolls p
                WHERE p.MeetingId = @MeetingId
                ORDER BY p.CreatedAt DESC";
            cmd.Parameters.AddWithValue("@MeetingId", meetingId);
            
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                polls.Add(new MeetingPoll
                {
                    Id = reader.GetInt32(0),
                    MeetingId = reader.GetInt32(1),
                    Title = reader.GetString(2),
                    Status = reader.GetString(3),
                    CreatorId = reader.GetInt32(4),
                    CreatedAt = reader.GetDateTime(5),
                    TotalVotes = reader.GetInt32(6)
                });
            }
            reader.Close();
            
            // Fetch Options for all polls
            if (polls.Count > 0)
            {
                using var optCmd = conn.CreateCommand();
                optCmd.CommandText = @"
                    SELECT o.Id, o.PollId, o.Content,
                           (SELECT COUNT(1) FROM MeetingPollVotes v WHERE v.OptionId = o.Id) as VoteCount
                    FROM MeetingPollOptions o
                    WHERE o.PollId IN (SELECT Id FROM MeetingPolls WHERE MeetingId = @MeetingId)";
                optCmd.Parameters.AddWithValue("@MeetingId", meetingId);
                
                using var optReader = await optCmd.ExecuteReaderAsync();
                while (await optReader.ReadAsync())
                {
                    var opt = new MeetingPollOption
                    {
                        Id = optReader.GetInt32(0),
                        PollId = optReader.GetInt32(1),
                        Content = optReader.GetString(2),
                        VoteCount = optReader.GetInt32(3)
                    };
                    var p = polls.Find(x => x.Id == opt.PollId);
                    if (p != null) p.Options.Add(opt);
                }
            }
            return polls;
        }

        public async Task<MeetingPoll?> GetPollAsync(int pollId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            
            MeetingPoll? poll = null;
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT p.Id, p.MeetingId, p.Title, p.Status, p.CreatorId, p.CreatedAt,
                       (SELECT COUNT(1) FROM MeetingPollVotes v WHERE v.PollId = p.Id) as TotalVotes
                FROM MeetingPolls p
                WHERE p.Id = @PollId";
            cmd.Parameters.AddWithValue("@PollId", pollId);
            
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                poll = new MeetingPoll
                {
                    Id = reader.GetInt32(0),
                    MeetingId = reader.GetInt32(1),
                    Title = reader.GetString(2),
                    Status = reader.GetString(3),
                    CreatorId = reader.GetInt32(4),
                    CreatedAt = reader.GetDateTime(5),
                    TotalVotes = reader.GetInt32(6)
                };
            }
            reader.Close();

            if (poll != null)
            {
                using var optCmd = conn.CreateCommand();
                optCmd.CommandText = @"
                    SELECT o.Id, o.PollId, o.Content,
                           (SELECT COUNT(1) FROM MeetingPollVotes v WHERE v.OptionId = o.Id) as VoteCount
                    FROM MeetingPollOptions o
                    WHERE o.PollId = @PollId";
                optCmd.Parameters.AddWithValue("@PollId", pollId);
                
                using var optReader = await optCmd.ExecuteReaderAsync();
                while (await optReader.ReadAsync())
                {
                    poll.Options.Add(new MeetingPollOption
                    {
                        Id = optReader.GetInt32(0),
                        PollId = optReader.GetInt32(1),
                        Content = optReader.GetString(2),
                        VoteCount = optReader.GetInt32(3)
                    });
                }
            }
            return poll;
        }

        public async Task<int> CreatePollAsync(int meetingId, string title, int creatorId, List<string> options)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var trans = conn.BeginTransaction();
            try
            {
                using var cmd = conn.CreateCommand();
                cmd.Transaction = trans;
                cmd.CommandText = @"
                    INSERT INTO MeetingPolls (MeetingId, Title, Status, CreatorId)
                    VALUES (@MeetingId, @Title, 'Open', @CreatorId);
                    SELECT last_insert_rowid();";
                cmd.Parameters.AddWithValue("@MeetingId", meetingId);
                cmd.Parameters.AddWithValue("@Title", title);
                cmd.Parameters.AddWithValue("@CreatorId", creatorId);
                
                int pollId = Convert.ToInt32(cmd.ExecuteScalar());

                foreach (var opt in options)
                {
                    using var optCmd = conn.CreateCommand();
                    optCmd.Transaction = trans;
                    optCmd.CommandText = @"
                        INSERT INTO MeetingPollOptions (PollId, Content)
                        VALUES (@PollId, @Content)";
                    optCmd.Parameters.AddWithValue("@PollId", pollId);
                    optCmd.Parameters.AddWithValue("@Content", opt);
                    optCmd.ExecuteNonQuery();
                }

                trans.Commit();
                return pollId;
            }
            catch
            {
                trans.Rollback();
                throw;
            }
        }

        public async Task<bool> UpdatePollStatusAsync(int pollId, string status)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE MeetingPolls SET Status = @Status WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Status", status);
            cmd.Parameters.AddWithValue("@Id", pollId);
            return (await cmd.ExecuteNonQueryAsync()) > 0;
        }

        public async Task<bool> CastVoteAsync(int pollId, int userId, int optionId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            
            // Check if poll is open
            cmd.CommandText = "SELECT Status FROM MeetingPolls WHERE Id = @PollId";
            cmd.Parameters.AddWithValue("@PollId", pollId);
            var status = await cmd.ExecuteScalarAsync() as string;
            if (status != "Open") return false;

            // Attempt insert (will fail if already voted due to PK)
            using var insCmd = conn.CreateCommand();
            insCmd.CommandText = @"
                INSERT INTO MeetingPollVotes (PollId, UserId, OptionId)
                VALUES (@PollId, @UserId, @OptionId)";
            insCmd.Parameters.AddWithValue("@PollId", pollId);
            insCmd.Parameters.AddWithValue("@UserId", userId);
            insCmd.Parameters.AddWithValue("@OptionId", optionId);
            
            try
            {
                return (await insCmd.ExecuteNonQueryAsync()) > 0;
            }
            catch (SqliteException ex) when (ex.SqliteErrorCode == 19) // Constraint violation
            {
                return false;
            }
        }

        public async Task<List<MeetingPollVote>> GetUserVotesAsync(int pollId, int userId)
        {
            var votes = new List<MeetingPollVote>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT PollId, UserId, OptionId, CreatedAt 
                FROM MeetingPollVotes 
                WHERE PollId = @PollId AND UserId = @UserId";
            cmd.Parameters.AddWithValue("@PollId", pollId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                votes.Add(new MeetingPollVote
                {
                    PollId = reader.GetInt32(0),
                    UserId = reader.GetInt32(1),
                    OptionId = reader.GetInt32(2),
                    CreatedAt = reader.GetDateTime(3)
                });
            }
            return votes;
        }

        public async Task<List<MeetingComment>> GetCommentsAsync(int meetingId)
        {
            var comments = new List<MeetingComment>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT c.Id, c.MeetingId, c.UserId, u.FullName as UserName, c.Content, c.CreatedAt
                FROM MeetingComments c
                JOIN Users u ON c.UserId = u.Id
                WHERE c.MeetingId = @MeetingId
                ORDER BY c.CreatedAt ASC";
            cmd.Parameters.AddWithValue("@MeetingId", meetingId);
            
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                comments.Add(new MeetingComment
                {
                    Id = reader.GetInt32(0),
                    MeetingId = reader.GetInt32(1),
                    UserId = reader.GetInt32(2),
                    UserName = reader.IsDBNull(3) ? "Unknown" : reader.GetString(3),
                    Content = reader.GetString(4),
                    CreatedAt = reader.GetDateTime(5)
                });
            }
            return comments;
        }

        public async Task<int> AddCommentAsync(int meetingId, int userId, string content)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO MeetingComments (MeetingId, UserId, Content)
                VALUES (@MeetingId, @UserId, @Content);
                SELECT last_insert_rowid();";
            cmd.Parameters.AddWithValue("@MeetingId", meetingId);
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@Content", content);
            
            return Convert.ToInt32(await cmd.ExecuteScalarAsync());
        }
    }
}
