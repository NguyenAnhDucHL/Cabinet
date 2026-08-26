using System.Collections.Generic;
using System.Threading.Tasks;
using Cabinet.Core.Models;
using Cabinet.Models;

namespace Cabinet.Core.Data.Interfaces
{
    public interface IDocumentRepository
    {
        // Folders
        Task<List<DocumentFolder>> GetFoldersAsync(string type, int? creatorId = null, int? parentId = null);
        Task<DocumentFolder?> GetFolderByIdAsync(int id);
        Task<int> InsertFolderAsync(DocumentFolder folder);
        Task<bool> UpdateFolderAsync(DocumentFolder folder);
        Task<bool> DeleteFolderAsync(int id);

        // Documents
        Task<List<Document>> GetDocumentsAsync(string type, int? creatorId = null, int? folderId = null);
        Task<List<Document>> GetImportantDocumentsAsync(int userId);
        Task<List<Document>> GetSharedWithMeDocumentsAsync(int userId);
        Task<Document?> GetDocumentByIdAsync(int id, int? currentUserId = null);
        
        Task<int> InsertDocumentAsync(Document document);
        Task<bool> UpdateDocumentAsync(Document document);
        Task<bool> DeleteDocumentAsync(int id);

        // Important
        Task<bool> MarkAsImportantAsync(int userId, int documentId);
        Task<bool> UnmarkAsImportantAsync(int userId, int documentId);

        // Share
        Task<bool> ShareDocumentAsync(int documentId, int sharedWithUserId, int sharedByUserId);
        Task<bool> UnshareDocumentAsync(int documentId, int sharedWithUserId);
        Task<List<User>> GetDocumentSharesAsync(int documentId);
    }
}
