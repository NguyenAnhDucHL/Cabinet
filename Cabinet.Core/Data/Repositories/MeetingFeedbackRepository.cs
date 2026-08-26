using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using Cabinet.Core.Models;

namespace Cabinet.Core.Data.Repositories
{
    public interface IMeetingFeedbackRepository
    {
        Task<List<MeetingFeedback>> GetByMeetingIdAsync(int meetingId);
        Task<int> CreateAsync(MeetingFeedback feedback);
        Task<bool> DeleteAsync(int id);
    }

    public class MeetingFeedbackRepository : IMeetingFeedbackRepository
    {
        private readonly string _connectionString;

        public MeetingFeedbackRepository(IConfiguration configuration)
        {
            var dbPath = Environment.GetEnvironmentVariable("DB_PATH")
                ?? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "Cabinet", "documents.db");
            _connectionString = $"Data Source={dbPath};Pooling=True;Default Timeout=30;Cache=Shared";
        }

        public async Task<List<MeetingFeedback>> GetByMeetingIdAsync(int meetingId)
        {
            var list = new List<MeetingFeedback>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT f.Id, f.MeetingId, f.UserId, f.ContentRef, f.DocumentRef,
                       f.Detail, f.AttachmentPaths, f.CreatedAt,
                       u.FullName AS UserFullName, u.Role AS UserRole
                FROM MeetingFeedbacks f
                LEFT JOIN Users u ON u.Id = f.UserId
                WHERE f.MeetingId = @MeetingId
                ORDER BY f.CreatedAt DESC";
            cmd.Parameters.AddWithValue("@MeetingId", meetingId);
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var attachments = new List<string>();
                try
                {
                    var raw = reader["AttachmentPaths"]?.ToString() ?? "[]";
                    attachments = JsonSerializer.Deserialize<List<string>>(raw) ?? new();
                }
                catch { }

                list.Add(new MeetingFeedback
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    MeetingId = Convert.ToInt32(reader["MeetingId"]),
                    UserId = Convert.ToInt32(reader["UserId"]),
                    ContentRef = reader["ContentRef"]?.ToString(),
                    DocumentRef = reader["DocumentRef"]?.ToString(),
                    Detail = reader["Detail"]?.ToString() ?? "",
                    AttachmentPaths = attachments,
                    CreatedAt = DateTime.Parse(reader["CreatedAt"]?.ToString() ?? DateTime.Now.ToString()),
                    UserFullName = reader["UserFullName"]?.ToString(),
                    UserRole = reader["UserRole"]?.ToString(),
                });
            }
            return list;
        }

        public async Task<int> CreateAsync(MeetingFeedback feedback)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO MeetingFeedbacks (MeetingId, UserId, ContentRef, DocumentRef, Detail, AttachmentPaths, CreatedAt)
                VALUES (@MeetingId, @UserId, @ContentRef, @DocumentRef, @Detail, @AttachmentPaths, @CreatedAt);
                SELECT last_insert_rowid();";
            cmd.Parameters.AddWithValue("@MeetingId", feedback.MeetingId);
            cmd.Parameters.AddWithValue("@UserId", feedback.UserId);
            cmd.Parameters.AddWithValue("@ContentRef", (object?)feedback.ContentRef ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@DocumentRef", (object?)feedback.DocumentRef ?? DBNull.Value);
            cmd.Parameters.AddWithValue("@Detail", feedback.Detail);
            cmd.Parameters.AddWithValue("@AttachmentPaths", JsonSerializer.Serialize(feedback.AttachmentPaths));
            cmd.Parameters.AddWithValue("@CreatedAt", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM MeetingFeedbacks WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            return await cmd.ExecuteNonQueryAsync() > 0;
        }
    }
}
