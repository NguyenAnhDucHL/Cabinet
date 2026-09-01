using System.Data;
using Microsoft.Data.Sqlite;
using Cabinet.Core.Models;
using Microsoft.Extensions.Configuration;

namespace Cabinet.Core.Data.Repositories
{
    public interface IPositionRepository
    {
        Task<List<Position>> GetAllAsync();
        Task<Position?> GetByIdAsync(int id);
        Task<int> CreateAsync(Position position);
        Task<bool> UpdateAsync(Position position);
        Task<bool> DeleteAsync(int id);
    }

    public class PositionRepository : IPositionRepository
    {
        private readonly string _connectionString;

        public PositionRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? $"Data Source={Environment.GetEnvironmentVariable("DB_PATH") ?? "data_dump/documents.db"}";
        }

        public async Task<List<Position>> GetAllAsync()
        {
            var list = new List<Position>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT Id, Name, Description, CreatedAt FROM Positions ORDER BY Name";
            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                list.Add(new Position
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    CreatedAt = reader.IsDBNull(3) ? DateTime.MinValue : reader.GetDateTime(3)
                });
            }
            return list;
        }

        public async Task<Position?> GetByIdAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT Id, Name, Description, CreatedAt FROM Positions WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new Position
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    Description = reader.IsDBNull(2) ? null : reader.GetString(2),
                    CreatedAt = reader.IsDBNull(3) ? DateTime.MinValue : reader.GetDateTime(3)
                };
            }
            return null;
        }

        public async Task<int> CreateAsync(Position position)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO Positions (Name, Description)
                VALUES (@Name, @Description);
                SELECT last_insert_rowid();";
            cmd.Parameters.AddWithValue("@Name", position.Name);
            cmd.Parameters.AddWithValue("@Description", position.Description ?? (object)DBNull.Value);
            return Convert.ToInt32(await cmd.ExecuteScalarAsync());
        }

        public async Task<bool> UpdateAsync(Position position)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                UPDATE Positions
                SET Name = @Name, Description = @Description
                WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Name", position.Name);
            cmd.Parameters.AddWithValue("@Description", position.Description ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@Id", position.Id);
            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM Positions WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);
            return await cmd.ExecuteNonQueryAsync() > 0;
        }
    }
}
