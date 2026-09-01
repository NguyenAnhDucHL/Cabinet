using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;

namespace Cabinet.Core.Data.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly string _connectionString;

        public ReportRepository(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DefaultConnection") 
                ?? "Data Source=/app/data/documents.db";
        }

        public async Task<object> GetOverviewStatsAsync()
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT 
                    (SELECT COUNT(*) FROM Meetings WHERE Status != 'Hủy') AS TotalMeetings,
                    (SELECT COUNT(*) FROM Meetings WHERE Status = 'Đang diễn ra') AS OngoingMeetings,
                    (SELECT COUNT(*) FROM MeetingParticipants WHERE AttendanceStatus = 'Có tham gia') AS TotalParticipants,
                    (SELECT COUNT(*) FROM Questionnaires) AS TotalQuestionnaires
            ";
            
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var totalMeetings = reader.GetInt32(0);
                var ongoingMeetings = reader.GetInt32(1);
                var totalParticipants = reader.GetInt32(2);
                var totalQuestionnaires = reader.GetInt32(3);

                // For chart: Meetings by Month (current year)
                var monthlyMeetings = await GetMonthlyMeetingsAsync(conn, DateTime.Now.Year);

                return new 
                {
                    TotalMeetings = totalMeetings,
                    OngoingMeetings = ongoingMeetings,
                    TotalParticipants = totalParticipants,
                    TotalQuestionnaires = totalQuestionnaires,
                    MonthlyMeetings = monthlyMeetings
                };
            }

            return new { };
        }

        private async Task<List<object>> GetMonthlyMeetingsAsync(SqliteConnection conn, int year)
        {
            var list = new List<object>();
            using var cmd = conn.CreateCommand();
            // strftime('%m', StartTime) returns '01', '02' etc.
            cmd.CommandText = @"
                SELECT strftime('%m', StartTime) AS Month, COUNT(*) AS Count
                FROM Meetings 
                WHERE strftime('%Y', StartTime) = @Year AND Status != 'Hủy'
                GROUP BY strftime('%m', StartTime)
                ORDER BY Month
            ";
            cmd.Parameters.AddWithValue("@Year", year.ToString());

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var monthStr = reader.IsDBNull(0) ? "01" : reader.GetString(0);
                var count = reader.IsDBNull(1) ? 0 : reader.GetInt32(1);
                list.Add(new { name = $"Tháng {monthStr}", meetings = count });
            }

            // fill missing months
            var result = new List<object>();
            for (int i = 1; i <= 12; i++)
            {
                var mStr = i.ToString("D2");
                var item = list.FirstOrDefault(x => ((dynamic)x).name == $"Tháng {mStr}");
                if (item != null)
                {
                    result.Add(item);
                }
                else
                {
                    result.Add(new { name = $"Tháng {mStr}", meetings = 0 });
                }
            }

            return result;
        }

        public async Task<List<object>> GetMeetingExportsAsync(DateTime? startDate, DateTime? endDate)
        {
            var list = new List<object>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            var sql = @"
                SELECT m.Id, m.Title, m.StartTime, m.EndTime, m.Status, m.Location,
                       (SELECT COUNT(*) FROM MeetingParticipants p WHERE p.MeetingId = m.Id) AS TotalInvited,
                       (SELECT COUNT(*) FROM MeetingParticipants p WHERE p.MeetingId = m.Id AND p.AttendanceStatus = 'Có tham gia') AS TotalAttended
                FROM Meetings m
                WHERE m.Status != 'Hủy'
            ";

            if (startDate.HasValue)
            {
                sql += " AND m.StartTime >= @StartDate";
                cmd.Parameters.AddWithValue("@StartDate", startDate.Value.ToString("yyyy-MM-ddTHH:mm:ss"));
            }
            if (endDate.HasValue)
            {
                sql += " AND m.StartTime <= @EndDate";
                // Include end of day
                cmd.Parameters.AddWithValue("@EndDate", endDate.Value.ToString("yyyy-MM-ddT23:59:59"));
            }

            sql += " ORDER BY m.StartTime DESC";
            cmd.CommandText = sql;

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var start = reader.IsDBNull(2) ? "" : reader.GetString(2);
                var end = reader.IsDBNull(3) ? "" : reader.GetString(3);
                
                list.Add(new
                {
                    Id = reader.GetInt32(0),
                    Title = reader.IsDBNull(1) ? "" : reader.GetString(1),
                    StartTime = start,
                    EndTime = end,
                    Status = reader.IsDBNull(4) ? "" : reader.GetString(4),
                    Location = reader.IsDBNull(5) ? "" : reader.GetString(5),
                    TotalInvited = reader.GetInt32(6),
                    TotalAttended = reader.GetInt32(7)
                });
            }

            return list;
        }
    }
}
