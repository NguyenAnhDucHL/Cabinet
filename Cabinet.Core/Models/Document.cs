using System;

namespace Cabinet.Core.Models
{
    public class DocumentFolder
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public string? Type { get; set; } // "DungChung" or "CaNhan"
        public int? CreatorId { get; set; }
        public DateTime? CreatedAt { get; set; }
        
        // Navigation properties equivalent for UI
        public int ChildrenCount { get; set; }
    }

    public class Document
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? FileType { get; set; }
        public string? FilePath { get; set; }
        public string? DocumentType { get; set; } // Loại tài liệu
        public string? IssuingAuthority { get; set; } // Cơ quan ban hành
        public int? FolderId { get; set; }
        public int? CreatorId { get; set; }
        public string? Type { get; set; } // "DungChung" or "CaNhan"
        public DateTime? CreatedAt { get; set; }
        
        // Joined properties
        public bool IsImportant { get; set; } // Marked by current user
        public bool IsSharedWithMe { get; set; }
    }

    public class DocumentShare
    {
        public int DocumentId { get; set; }
        public int SharedWithUserId { get; set; }
        public int SharedByUserId { get; set; }
    }

    public class UserImportantDocument
    {
        public int UserId { get; set; }
        public int DocumentId { get; set; }
    }
}
