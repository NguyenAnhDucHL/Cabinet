using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Cabinet.Models;

namespace Cabinet.Core.Data.Repositories
{
    public interface IQuestionnaireRepository
    {
        Task<List<Questionnaire>> GetAllAsync(string? statusFilter = null);
        Task<List<Questionnaire>> GetAllByMeetingIdAsync(int meetingId);
        Task<List<Questionnaire>> GetMyAssignedAsync(int userId);
        Task<QuestionnaireDetail?> GetDetailAsync(int id, int userId);
        Task<int> CreateAsync(CreateQuestionnaireRequest req);
        Task<bool> SendAsync(int id);
        Task<bool> SubmitResponseAsync(int questionnaireId, int responderId, List<QuestionnaireResponseInput> responses);
        Task<bool> DeleteAsync(int id);
    }

    public class QuestionnaireRepository : IQuestionnaireRepository
    {
        private readonly string _connectionString;

        public QuestionnaireRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? $"Data Source={Environment.GetEnvironmentVariable("DB_PATH") ?? "data_dump/documents.db"}";
        }

        public async Task<List<Questionnaire>> GetAllByMeetingIdAsync(int meetingId)
        {
            var list = new List<Questionnaire>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT Id, MeetingId, Title, AssignedTo, Deadline, Status, CreatedAt 
                FROM Questionnaires 
                WHERE MeetingId = @MeetingId
                ORDER BY CreatedAt DESC";
            cmd.Parameters.AddWithValue("@MeetingId", meetingId);

            using var reader = await cmd.ExecuteReaderAsync();
            while(await reader.ReadAsync())
            {
                list.Add(new Questionnaire
                {
                    Id = reader.GetInt32(0),
                    MeetingId = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                    Title = reader.GetString(2),
                    AssignedTo = reader.IsDBNull(3) ? 0 : reader.GetInt32(3),
                    Deadline = reader.IsDBNull(4) ? DateTime.MinValue : reader.GetDateTime(4),
                    Status = reader.GetString(5),
                    CreatedAt = reader.IsDBNull(6) ? DateTime.MinValue : reader.GetDateTime(6)
                });
            }
            return list;
        }

        public async Task<List<Questionnaire>> GetAllAsync(string? statusFilter = null)
        {
            var list = new List<Questionnaire>();
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            string whereClause = "";
            if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "All")
            {
                whereClause = "WHERE q.Status = @status";
            }

            string sql = $@"
                SELECT q.Id, q.MeetingId, q.Title, q.AssignedTo, q.TemplateId, q.Type, q.AttachmentPaths, q.Content, q.AssignedUserIds, q.Deadline, q.Status, q.CreatedAt, 
                       m.Title as MeetingTitle, u.FullName as AssignedToName 
                FROM Questionnaires q 
                LEFT JOIN Meetings m ON q.MeetingId = m.Id 
                LEFT JOIN Users u ON q.AssignedTo = u.Id 
                {whereClause}
                ORDER BY q.CreatedAt DESC";

            using var cmd = new SqliteCommand(sql, connection);
            if (!string.IsNullOrEmpty(statusFilter) && statusFilter != "All")
            {
                cmd.Parameters.AddWithValue("@status", statusFilter);
            }

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var q = new Questionnaire
                {
                    Id = Convert.ToInt32(reader["Id"]),
                    MeetingId = Convert.ToInt32(reader["MeetingId"]),
                    MeetingTitle = reader["MeetingTitle"]?.ToString(),
                    Title = reader["Title"]?.ToString() ?? "",
                    AssignedTo = Convert.ToInt32(reader["AssignedTo"]),
                    AssignedToName = reader["AssignedToName"]?.ToString(),
                    Deadline = DateTime.Parse(reader["Deadline"]?.ToString() ?? DateTime.UtcNow.ToString()),
                    Status = reader["Status"]?.ToString() ?? "Chưa trả lời",
                    CreatedAt = DateTime.Parse(reader["CreatedAt"]?.ToString() ?? DateTime.UtcNow.ToString()),
                    
                    // New fields
                    TemplateId = reader["TemplateId"] != DBNull.Value ? Convert.ToInt32(reader["TemplateId"]) : null,
                    Type = reader["Type"]?.ToString(),
                    Content = reader["Content"]?.ToString()
                };

                var attachmentPathsStr = reader["AttachmentPaths"]?.ToString();
                if (!string.IsNullOrEmpty(attachmentPathsStr))
                {
                    q.AttachmentPaths = System.Text.Json.JsonSerializer.Deserialize<List<string>>(attachmentPathsStr) ?? new List<string>();
                }

                var assignedUserIdsStr = reader["AssignedUserIds"]?.ToString();
                if (!string.IsNullOrEmpty(assignedUserIdsStr))
                {
                    q.AssignedUserIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(assignedUserIdsStr) ?? new List<int>();
                }

                list.Add(q);
            }

            return list;
        }

        public async Task<int> CreateAsync(CreateQuestionnaireRequest req)
        {
            using var connection = new SqliteConnection(_connectionString);
            await connection.OpenAsync();

            string sql = @"
                INSERT INTO Questionnaires (MeetingId, Title, TemplateId, Type, AttachmentPaths, Content, AssignedUserIds, Deadline, Status, CreatedAt, AssignedTo) 
                VALUES (@MeetingId, @Title, @TemplateId, @Type, @AttachmentPaths, @Content, @AssignedUserIds, @Deadline, 'Chưa trả lời', @CreatedAt, NULL);
                SELECT last_insert_rowid();";

            using var cmd = new SqliteCommand(sql, connection);
            cmd.Parameters.AddWithValue("@MeetingId", req.MeetingId > 0 ? (object)req.MeetingId : DBNull.Value);
            cmd.Parameters.AddWithValue("@Title", req.Title);
            cmd.Parameters.AddWithValue("@TemplateId", req.TemplateId.HasValue ? (object)req.TemplateId.Value : DBNull.Value);
            cmd.Parameters.AddWithValue("@Type", req.Type ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@AttachmentPaths", System.Text.Json.JsonSerializer.Serialize(req.AttachmentPaths));
            cmd.Parameters.AddWithValue("@Content", req.Content ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@AssignedUserIds", System.Text.Json.JsonSerializer.Serialize(req.AssignedUserIds));
            cmd.Parameters.AddWithValue("@Deadline", req.Deadline.ToString("O"));
            cmd.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow.ToString("O"));

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }
        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var tx = conn.BeginTransaction();
            try
            {
                new SqliteCommand("DELETE FROM QuestionnaireResponses WHERE QuestionnaireId=@id", conn, tx) { Parameters = { new SqliteParameter("@id", id) } }.ExecuteNonQuery();
                new SqliteCommand("DELETE FROM QuestionnaireItemOptions WHERE ItemId IN (SELECT Id FROM QuestionnaireItems WHERE QuestionnaireId=@id)", conn, tx) { Parameters = { new SqliteParameter("@id", id) } }.ExecuteNonQuery();
                new SqliteCommand("DELETE FROM QuestionnaireItems WHERE QuestionnaireId=@id", conn, tx) { Parameters = { new SqliteParameter("@id", id) } }.ExecuteNonQuery();
                using var cmd = new SqliteCommand("DELETE FROM Questionnaires WHERE Id=@id", conn, tx);
                cmd.Parameters.AddWithValue("@id", id);
                int rows = cmd.ExecuteNonQuery();
                tx.Commit();
                return rows > 0;
            }
            catch { tx.Rollback(); throw; }
        }

        public async Task<bool> SendAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = new SqliteCommand("UPDATE Questionnaires SET SentAt=@now, Status='Chưa trả lời' WHERE Id=@id AND SentAt IS NULL", conn);
            cmd.Parameters.AddWithValue("@now", DateTime.Now.ToString("o"));
            cmd.Parameters.AddWithValue("@id", id);
            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<List<Questionnaire>> GetMyAssignedAsync(int userId)
        {
            var list = new List<Questionnaire>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            // Phếu gửi đến userId (AssignedUserIds JSON chứa userId)
            string sql = @"
                SELECT q.Id, q.MeetingId, q.Title, q.AssignedTo, q.TemplateId, q.Type, q.AttachmentPaths, q.Content, q.AssignedUserIds, q.Deadline, q.Status, q.CreatedAt, q.SentAt,
                       m.Title as MeetingTitle, u.FullName as AssignedToName
                FROM Questionnaires q
                LEFT JOIN Meetings m ON q.MeetingId = m.Id
                LEFT JOIN Users u ON q.AssignedTo = u.Id
                WHERE q.SentAt IS NOT NULL
                  AND (
                    q.AssignedUserIds LIKE @pattern
                    OR CAST(q.AssignedTo AS TEXT) = @uid
                  )
                ORDER BY q.CreatedAt DESC";

            using var cmd = new SqliteCommand(sql, conn);
            cmd.Parameters.AddWithValue("@pattern", $"%{userId}%");
            cmd.Parameters.AddWithValue("@uid", userId.ToString());

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var q = MapQuestionnaire(reader);
                // Kiểm tra hải đã trả lời chưa
                list.Add(q);
            }
            return list;
        }

        public async Task<QuestionnaireDetail?> GetDetailAsync(int id, int userId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            // Lấy thông tin phiếu
            var qSql = @"
                SELECT q.Id, q.MeetingId, q.Title, q.AssignedTo, q.TemplateId, q.Type, q.AttachmentPaths, q.Content, q.AssignedUserIds, q.Deadline, q.Status, q.CreatedAt, q.SentAt,
                       m.Title as MeetingTitle, u.FullName as AssignedToName
                FROM Questionnaires q
                LEFT JOIN Meetings m ON q.MeetingId = m.Id
                LEFT JOIN Users u ON q.AssignedTo = u.Id
                WHERE q.Id = @id";

            using var qCmd = new SqliteCommand(qSql, conn);
            qCmd.Parameters.AddWithValue("@id", id);
            using var qReader = await qCmd.ExecuteReaderAsync();
            if (!await qReader.ReadAsync()) return null;
            var questionnaire = MapQuestionnaire(qReader);
            qReader.Close();

            // Lấy câu hỏi + phương án
            var items = new List<QuestionnaireItemDetail>();
            using var iCmd = new SqliteCommand(
                "SELECT Id, Content, ItemType, OrderIndex FROM QuestionnaireItems WHERE QuestionnaireId=@qid ORDER BY OrderIndex", conn);
            iCmd.Parameters.AddWithValue("@qid", id);
            using var iReader = await iCmd.ExecuteReaderAsync();
            while (await iReader.ReadAsync())
            {
                items.Add(new QuestionnaireItemDetail
                {
                    Id = Convert.ToInt32(iReader["Id"]),
                    Content = iReader["Content"]?.ToString() ?? "",
                    ItemType = iReader["ItemType"]?.ToString() ?? "Biểu quyết",
                    OrderIndex = Convert.ToInt32(iReader["OrderIndex"]),
                    Options = new(),
                });
            }
            iReader.Close();

            // Lấy phương án cho từng câu hỏi
            foreach (var item in items)
            {
                using var oCmd = new SqliteCommand(
                    "SELECT Id, OptionText, OrderIndex FROM QuestionnaireItemOptions WHERE ItemId=@iid ORDER BY OrderIndex", conn);
                oCmd.Parameters.AddWithValue("@iid", item.Id);
                using var oReader = await oCmd.ExecuteReaderAsync();
                while (await oReader.ReadAsync())
                {
                    item.Options.Add(new QuestionnaireOptionDetail
                    {
                        Id = Convert.ToInt32(oReader["Id"]),
                        OptionText = oReader["OptionText"]?.ToString() ?? "",
                        OrderIndex = Convert.ToInt32(oReader["OrderIndex"]),
                    });
                }
            }

            // Lấy câu trả lời của user hiện tại
            var myResponses = new List<QuestionnaireResponseDetail>();
            using var rCmd = new SqliteCommand(
                "SELECT ItemId, SelectedOptionId, ResponseText FROM QuestionnaireResponses WHERE QuestionnaireId=@qid AND ResponderId=@uid", conn);
            rCmd.Parameters.AddWithValue("@qid", id);
            rCmd.Parameters.AddWithValue("@uid", userId);
            using var rReader = await rCmd.ExecuteReaderAsync();
            while (await rReader.ReadAsync())
            {
                myResponses.Add(new QuestionnaireResponseDetail
                {
                    ItemId = Convert.ToInt32(rReader["ItemId"]),
                    SelectedOptionId = rReader["SelectedOptionId"] == DBNull.Value ? null : Convert.ToInt32(rReader["SelectedOptionId"]),
                    ResponseText = rReader["ResponseText"]?.ToString(),
                });
            }

            return new QuestionnaireDetail
            {
                Questionnaire = questionnaire,
                Items = items,
                MyResponses = myResponses,
                HasResponded = myResponses.Count > 0,
            };
        }

        public async Task<bool> SubmitResponseAsync(int questionnaireId, int responderId, List<QuestionnaireResponseInput> responses)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var tx = conn.BeginTransaction();
            try
            {
                // Xóa câu trả lời cũ của user này
                new SqliteCommand("DELETE FROM QuestionnaireResponses WHERE QuestionnaireId=@qid AND ResponderId=@uid", conn, tx)
                {
                    Parameters = { new SqliteParameter("@qid", questionnaireId), new SqliteParameter("@uid", responderId) }
                }.ExecuteNonQuery();

                // Thêm câu trả lời mới
                foreach (var r in responses)
                {
                    using var ins = new SqliteCommand(
                        "INSERT INTO QuestionnaireResponses (QuestionnaireId, ItemId, ResponderId, SelectedOptionId, ResponseText, RespondedAt) VALUES (@qid, @iid, @uid, @opt, @txt, @now)",
                        conn, tx);
                    ins.Parameters.AddWithValue("@qid", questionnaireId);
                    ins.Parameters.AddWithValue("@iid", r.ItemId);
                    ins.Parameters.AddWithValue("@uid", responderId);
                    ins.Parameters.AddWithValue("@opt", r.SelectedOptionId.HasValue ? r.SelectedOptionId.Value : DBNull.Value);
                    ins.Parameters.AddWithValue("@txt", r.ResponseText ?? (object)DBNull.Value);
                    ins.Parameters.AddWithValue("@now", DateTime.Now.ToString("o"));
                    ins.ExecuteNonQuery();
                }

                // Cập nhật trạng thái phiếu thành 'Đã trả lời'
                new SqliteCommand("UPDATE Questionnaires SET Status='Đã trả lời' WHERE Id=@id", conn, tx)
                {
                    Parameters = { new SqliteParameter("@id", questionnaireId) }
                }.ExecuteNonQuery();

                tx.Commit();
                return true;
            }
            catch { tx.Rollback(); throw; }
        }

        private static Questionnaire MapQuestionnaire(SqliteDataReader reader)
        {
            var q = new Questionnaire
            {
                Id = Convert.ToInt32(reader["Id"]),
                MeetingId = Convert.ToInt32(reader["MeetingId"]),
                MeetingTitle = reader["MeetingTitle"]?.ToString(),
                Title = reader["Title"]?.ToString() ?? "",
                AssignedTo = Convert.ToInt32(reader["AssignedTo"]),
                AssignedToName = reader["AssignedToName"]?.ToString(),
                Deadline = DateTime.Parse(reader["Deadline"]?.ToString() ?? DateTime.UtcNow.ToString()),
                Status = reader["Status"]?.ToString() ?? "Chưa trả lời",
                CreatedAt = DateTime.Parse(reader["CreatedAt"]?.ToString() ?? DateTime.UtcNow.ToString()),
                TemplateId = reader["TemplateId"] != DBNull.Value ? Convert.ToInt32(reader["TemplateId"]) : null,
                Type = reader["Type"]?.ToString(),
                Content = reader["Content"]?.ToString(),
            };
            var attachStr = reader["AttachmentPaths"]?.ToString();
            if (!string.IsNullOrEmpty(attachStr))
                q.AttachmentPaths = System.Text.Json.JsonSerializer.Deserialize<List<string>>(attachStr) ?? new();
            var aidStr = reader["AssignedUserIds"]?.ToString();
            if (!string.IsNullOrEmpty(aidStr))
                q.AssignedUserIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(aidStr) ?? new();
            return q;
        }
    }
}
