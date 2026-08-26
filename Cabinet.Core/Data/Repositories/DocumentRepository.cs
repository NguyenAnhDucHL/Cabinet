using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Configuration;
using Cabinet.Core.Data.Interfaces;
using Cabinet.Core.Models;
using Cabinet.Models;

namespace Cabinet.Core.Data.Repositories
{
    public class DocumentRepository : IDocumentRepository
    {
        private readonly string _connectionString;

        public DocumentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") 
                ?? "Data Source=/app/data/documents.db";
        }

        public async Task<List<DocumentFolder>> GetFoldersAsync(string type, int? creatorId = null, int? parentId = null)
        {
            var folders = new List<DocumentFolder>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            var sql = @"
                SELECT Id, Name, ParentId, Type, CreatorId, CreatedAt
                FROM DocumentFolders
                WHERE Type = @Type ";
            
            cmd.Parameters.AddWithValue("@Type", type);

            if (creatorId.HasValue && type == "CaNhan")
            {
                sql += " AND CreatorId = @CreatorId ";
                cmd.Parameters.AddWithValue("@CreatorId", creatorId.Value);
            }

            if (parentId.HasValue)
            {
                sql += " AND ParentId = @ParentId ";
                cmd.Parameters.AddWithValue("@ParentId", parentId.Value);
            }
            else
            {
                sql += " AND ParentId IS NULL ";
            }

            sql += " ORDER BY Name ASC ";
            cmd.CommandText = sql;

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                folders.Add(new DocumentFolder
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    ParentId = reader.IsDBNull(2) ? null : reader.GetInt32(2),
                    Type = reader.IsDBNull(3) ? null : reader.GetString(3),
                    CreatorId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                    CreatedAt = reader.IsDBNull(5) ? null : DateTime.Parse(reader.GetString(5))
                });
            }

            // Optional: Count children for each folder. We can skip it here for performance or do a subquery.
            // A subquery in the main SQL would be better. Let's keep it simple for now.
            return folders;
        }

        public async Task<DocumentFolder?> GetFolderByIdAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT Id, Name, ParentId, Type, CreatorId, CreatedAt
                FROM DocumentFolders
                WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);

            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                return new DocumentFolder
                {
                    Id = reader.GetInt32(0),
                    Name = reader.GetString(1),
                    ParentId = reader.IsDBNull(2) ? null : reader.GetInt32(2),
                    Type = reader.IsDBNull(3) ? null : reader.GetString(3),
                    CreatorId = reader.IsDBNull(4) ? null : reader.GetInt32(4),
                    CreatedAt = reader.IsDBNull(5) ? null : DateTime.Parse(reader.GetString(5))
                };
            }
            return null;
        }

        public async Task<int> InsertFolderAsync(DocumentFolder folder)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO DocumentFolders (Name, ParentId, Type, CreatorId)
                VALUES (@Name, @ParentId, @Type, @CreatorId);
                SELECT last_insert_rowid();";
                
            cmd.Parameters.AddWithValue("@Name", folder.Name);
            cmd.Parameters.AddWithValue("@ParentId", folder.ParentId.HasValue ? folder.ParentId.Value : DBNull.Value);
            cmd.Parameters.AddWithValue("@Type", folder.Type ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@CreatorId", folder.CreatorId.HasValue ? folder.CreatorId.Value : DBNull.Value);

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateFolderAsync(DocumentFolder folder)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                UPDATE DocumentFolders 
                SET Name = @Name, ParentId = @ParentId
                WHERE Id = @Id";
                
            cmd.Parameters.AddWithValue("@Id", folder.Id);
            cmd.Parameters.AddWithValue("@Name", folder.Name);
            cmd.Parameters.AddWithValue("@ParentId", folder.ParentId.HasValue ? folder.ParentId.Value : DBNull.Value);

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> DeleteFolderAsync(int id)
        {
            // Note: Should also delete child folders and documents.
            // For simplicity, we just delete the folder here.
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM DocumentFolders WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<List<Document>> GetDocumentsAsync(string type, int? creatorId = null, int? folderId = null)
        {
            var documents = new List<Document>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            var sql = @"
                SELECT Id, Name, FileType, FilePath, DocumentType, IssuingAuthority, FolderId, CreatorId, Type, CreatedAt
                FROM Documents
                WHERE Type = @Type ";
            
            cmd.Parameters.AddWithValue("@Type", type);

            if (creatorId.HasValue && type == "CaNhan")
            {
                sql += " AND CreatorId = @CreatorId ";
                cmd.Parameters.AddWithValue("@CreatorId", creatorId.Value);
            }

            if (folderId.HasValue)
            {
                sql += " AND FolderId = @FolderId ";
                cmd.Parameters.AddWithValue("@FolderId", folderId.Value);
            }
            else
            {
                sql += " AND FolderId IS NULL ";
            }

            sql += " ORDER BY CreatedAt DESC ";
            cmd.CommandText = sql;

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                documents.Add(MapDocument(reader));
            }

            return documents;
        }

        public async Task<List<Document>> GetImportantDocumentsAsync(int userId)
        {
            var documents = new List<Document>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT d.Id, d.Name, d.FileType, d.FilePath, d.DocumentType, d.IssuingAuthority, d.FolderId, d.CreatorId, d.Type, d.CreatedAt
                FROM Documents d
                INNER JOIN UserImportantDocuments uid ON d.Id = uid.DocumentId
                WHERE uid.UserId = @UserId
                ORDER BY d.CreatedAt DESC";
            
            cmd.Parameters.AddWithValue("@UserId", userId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var doc = MapDocument(reader);
                doc.IsImportant = true;
                documents.Add(doc);
            }
            return documents;
        }

        public async Task<List<Document>> GetSharedWithMeDocumentsAsync(int userId)
        {
            var documents = new List<Document>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT d.Id, d.Name, d.FileType, d.FilePath, d.DocumentType, d.IssuingAuthority, d.FolderId, d.CreatorId, d.Type, d.CreatedAt
                FROM Documents d
                INNER JOIN DocumentShares ds ON d.Id = ds.DocumentId
                WHERE ds.SharedWithUserId = @UserId
                ORDER BY d.CreatedAt DESC";
            
            cmd.Parameters.AddWithValue("@UserId", userId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                var doc = MapDocument(reader);
                doc.IsSharedWithMe = true;
                documents.Add(doc);
            }
            return documents;
        }

        public async Task<Document?> GetDocumentByIdAsync(int id, int? currentUserId = null)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT Id, Name, FileType, FilePath, DocumentType, IssuingAuthority, FolderId, CreatorId, Type, CreatedAt
                FROM Documents
                WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);

            using var reader = await cmd.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var doc = MapDocument(reader);
                
                // If a userId is provided, check if it is marked as important
                if (currentUserId.HasValue)
                {
                    reader.Close();
                    using var checkCmd = conn.CreateCommand();
                    checkCmd.CommandText = "SELECT 1 FROM UserImportantDocuments WHERE UserId = @Uid AND DocumentId = @Did";
                    checkCmd.Parameters.AddWithValue("@Uid", currentUserId.Value);
                    checkCmd.Parameters.AddWithValue("@Did", id);
                    var exists = await checkCmd.ExecuteScalarAsync();
                    if (exists != null) doc.IsImportant = true;
                }
                
                return doc;
            }
            return null;
        }

        public async Task<int> InsertDocumentAsync(Document document)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT INTO Documents (Name, FileType, FilePath, DocumentType, IssuingAuthority, FolderId, CreatorId, Type)
                VALUES (@Name, @FileType, @FilePath, @DocumentType, @IssuingAuthority, @FolderId, @CreatorId, @Type);
                SELECT last_insert_rowid();";
                
            cmd.Parameters.AddWithValue("@Name", document.Name);
            cmd.Parameters.AddWithValue("@FileType", document.FileType ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@FilePath", document.FilePath ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@DocumentType", document.DocumentType ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@IssuingAuthority", document.IssuingAuthority ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@FolderId", document.FolderId.HasValue ? document.FolderId.Value : DBNull.Value);
            cmd.Parameters.AddWithValue("@CreatorId", document.CreatorId.HasValue ? document.CreatorId.Value : DBNull.Value);
            cmd.Parameters.AddWithValue("@Type", document.Type ?? (object)DBNull.Value);

            var result = await cmd.ExecuteScalarAsync();
            return Convert.ToInt32(result);
        }

        public async Task<bool> UpdateDocumentAsync(Document document)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                UPDATE Documents 
                SET Name = @Name, FileType = @FileType, FilePath = @FilePath, 
                    DocumentType = @DocumentType, IssuingAuthority = @IssuingAuthority, FolderId = @FolderId
                WHERE Id = @Id";
                
            cmd.Parameters.AddWithValue("@Id", document.Id);
            cmd.Parameters.AddWithValue("@Name", document.Name);
            cmd.Parameters.AddWithValue("@FileType", document.FileType ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@FilePath", document.FilePath ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@DocumentType", document.DocumentType ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@IssuingAuthority", document.IssuingAuthority ?? (object)DBNull.Value);
            cmd.Parameters.AddWithValue("@FolderId", document.FolderId.HasValue ? document.FolderId.Value : DBNull.Value);

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> DeleteDocumentAsync(int id)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM Documents WHERE Id = @Id";
            cmd.Parameters.AddWithValue("@Id", id);

            // Cascade delete shouldn't be needed for SQLite if configured, but to be safe we can also delete shares and important flags.
            var cmd2 = conn.CreateCommand();
            cmd2.CommandText = "DELETE FROM DocumentShares WHERE DocumentId = @Id";
            cmd2.Parameters.AddWithValue("@Id", id);
            await cmd2.ExecuteNonQueryAsync();

            var cmd3 = conn.CreateCommand();
            cmd3.CommandText = "DELETE FROM UserImportantDocuments WHERE DocumentId = @Id";
            cmd3.Parameters.AddWithValue("@Id", id);
            await cmd3.ExecuteNonQueryAsync();

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> MarkAsImportantAsync(int userId, int documentId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT OR IGNORE INTO UserImportantDocuments (UserId, DocumentId)
                VALUES (@UserId, @DocumentId)";
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@DocumentId", documentId);

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> UnmarkAsImportantAsync(int userId, int documentId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM UserImportantDocuments WHERE UserId = @UserId AND DocumentId = @DocumentId";
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@DocumentId", documentId);

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> ShareDocumentAsync(int documentId, int sharedWithUserId, int sharedByUserId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                INSERT OR IGNORE INTO DocumentShares (DocumentId, SharedWithUserId, SharedByUserId)
                VALUES (@DocumentId, @SharedWithUserId, @SharedByUserId)";
            cmd.Parameters.AddWithValue("@DocumentId", documentId);
            cmd.Parameters.AddWithValue("@SharedWithUserId", sharedWithUserId);
            cmd.Parameters.AddWithValue("@SharedByUserId", sharedByUserId);

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<bool> UnshareDocumentAsync(int documentId, int sharedWithUserId)
        {
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM DocumentShares WHERE DocumentId = @DocumentId AND SharedWithUserId = @SharedWithUserId";
            cmd.Parameters.AddWithValue("@DocumentId", documentId);
            cmd.Parameters.AddWithValue("@SharedWithUserId", sharedWithUserId);

            return await cmd.ExecuteNonQueryAsync() > 0;
        }

        public async Task<List<User>> GetDocumentSharesAsync(int documentId)
        {
            var users = new List<User>();
            using var conn = new SqliteConnection(_connectionString);
            await conn.OpenAsync();

            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
                SELECT u.Id, u.Username, u.FullName, u.Email, u.Role, u.DepartmentId
                FROM Users u
                INNER JOIN DocumentShares ds ON u.Id = ds.SharedWithUserId
                WHERE ds.DocumentId = @DocumentId";
            cmd.Parameters.AddWithValue("@DocumentId", documentId);

            using var reader = await cmd.ExecuteReaderAsync();
            while (await reader.ReadAsync())
            {
                users.Add(new User
                {
                    Id = reader.GetInt32(0),
                    Username = reader.GetString(1),
                    FullName = reader.IsDBNull(2) ? null : reader.GetString(2),
                    Email = reader.IsDBNull(3) ? null : reader.GetString(3),
                    Role = reader.GetString(4),
                    DepartmentId = reader.IsDBNull(5) ? null : reader.GetInt32(5)
                });
            }
            return users;
        }

        private Document MapDocument(SqliteDataReader reader)
        {
            return new Document
            {
                Id = reader.GetInt32(0),
                Name = reader.GetString(1),
                FileType = reader.IsDBNull(2) ? null : reader.GetString(2),
                FilePath = reader.IsDBNull(3) ? null : reader.GetString(3),
                DocumentType = reader.IsDBNull(4) ? null : reader.GetString(4),
                IssuingAuthority = reader.IsDBNull(5) ? null : reader.GetString(5),
                FolderId = reader.IsDBNull(6) ? null : reader.GetInt32(6),
                CreatorId = reader.IsDBNull(7) ? null : reader.GetInt32(7),
                Type = reader.IsDBNull(8) ? null : reader.GetString(8),
                CreatedAt = reader.IsDBNull(9) ? null : DateTime.Parse(reader.GetString(9))
            };
        }
    }
}
