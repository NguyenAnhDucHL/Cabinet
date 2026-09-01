using System.Data;
using Microsoft.Data.Sqlite;
using Cabinet.Core.Models;
using Microsoft.Extensions.Configuration;

namespace Cabinet.Core.Data.Repositories
{
    public interface ISystemConfigRepository
    {
        Task<List<SystemConfig>> GetAllAsync();
        Task<bool> UpdateConfigsAsync(Dictionary<string, string> configs);
    }

    public class SystemConfigRepository : ISystemConfigRepository
    {
        private readonly string _connectionString;

        public SystemConfigRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? $"Data Source={Environment.GetEnvironmentVariable("DB_PATH") ?? "data_dump/documents.db"}";
        }

        public async Task<List<SystemConfig>> GetAllAsync()
        {
            var list = new List<SystemConfig>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT Id, KeyName, Value, UpdatedAt FROM SystemConfigs";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new SystemConfig
                {
                    Id = reader.GetInt32(0),
                    KeyName = reader.GetString(1),
                    Value = reader.IsDBNull(2) ? null : reader.GetString(2),
                    UpdatedAt = reader.IsDBNull(3) ? DateTime.MinValue : reader.GetDateTime(3)
                });
            }
            return list;
        }

        public async Task<bool> UpdateConfigsAsync(Dictionary<string, string> configs)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var transaction = conn.BeginTransaction();
            try
            {
                foreach (var kvp in configs)
                {
                    using var cmd = conn.CreateCommand();
                    cmd.Transaction = transaction;
                    cmd.CommandText = @"
                        INSERT INTO SystemConfigs (KeyName, Value, UpdatedAt)
                        VALUES (@Key, @Val, @Now)
                        ON CONFLICT(KeyName) DO UPDATE SET Value=excluded.Value, UpdatedAt=excluded.UpdatedAt;
                    ";
                    cmd.Parameters.AddWithValue("@Key", kvp.Key);
                    cmd.Parameters.AddWithValue("@Val", kvp.Value ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Now", DateTime.UtcNow.AddHours(7).ToString("yyyy-MM-dd HH:mm:ss"));
                    cmd.ExecuteNonQuery();
                }
                transaction.Commit();
                return true;
            }
            catch
            {
                transaction.Rollback();
                return false;
            }
        }
    }
}
