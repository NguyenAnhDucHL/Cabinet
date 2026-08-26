using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Cabinet.Core.Models;
using Cabinet.Models;
using Cabinet.Core.Data.Interfaces;

namespace Cabinet.Api.Controllers.Cabinet
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentsController : ControllerBase
    {
        private readonly IDocumentRepository _repo;

        public DocumentsController(IDocumentRepository repo)
        {
            _repo = repo;
        }

        private int GetCurrentUserId()
        {
            return int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");
        }

        // ==========================================
        // FOLDERS
        // ==========================================

        [HttpGet("folders")]
        public async Task<IActionResult> GetFolders([FromQuery] string type, [FromQuery] int? parentId = null)
        {
            if (string.IsNullOrEmpty(type)) return BadRequest(ApiResponse.Fail("Type is required (DungChung or CaNhan)"));

            int currentUserId = GetCurrentUserId();
            var folders = await _repo.GetFoldersAsync(type, type == "CaNhan" ? currentUserId : null, parentId);
            return Ok(ApiResponse<List<DocumentFolder>>.Ok(folders));
        }

        [HttpPost("folders")]
        public async Task<IActionResult> CreateFolder([FromBody] DocumentFolder model)
        {
            if (string.IsNullOrEmpty(model.Name)) return BadRequest(ApiResponse.Fail("Tên thư mục không được để trống"));
            if (string.IsNullOrEmpty(model.Type)) return BadRequest(ApiResponse.Fail("Type is required"));

            model.CreatorId = GetCurrentUserId();
            model.Id = await _repo.InsertFolderAsync(model);
            return Ok(ApiResponse<DocumentFolder>.Ok(model));
        }

        [HttpPut("folders/{id}")]
        public async Task<IActionResult> UpdateFolder(int id, [FromBody] DocumentFolder model)
        {
            var existing = await _repo.GetFolderByIdAsync(id);
            if (existing == null) return NotFound(ApiResponse.Fail("Không tìm thấy thư mục"));

            existing.Name = model.Name;
            existing.ParentId = model.ParentId;
            
            await _repo.UpdateFolderAsync(existing);
            return Ok(ApiResponse.Ok("Cập nhật thành công"));
        }

        [HttpDelete("folders/{id}")]
        public async Task<IActionResult> DeleteFolder(int id)
        {
            var success = await _repo.DeleteFolderAsync(id);
            if (success) return Ok(ApiResponse.Ok("Xóa thư mục thành công"));
            return BadRequest(ApiResponse.Fail("Lỗi khi xóa thư mục"));
        }


        // ==========================================
        // DOCUMENTS
        // ==========================================

        [HttpGet]
        public async Task<IActionResult> GetDocuments([FromQuery] string type, [FromQuery] int? folderId = null)
        {
            int currentUserId = GetCurrentUserId();
            List<Document> docs;

            if (type == "QuanTrong")
            {
                docs = await _repo.GetImportantDocumentsAsync(currentUserId);
            }
            else if (type == "DuocChiaSe")
            {
                docs = await _repo.GetSharedWithMeDocumentsAsync(currentUserId);
            }
            else
            {
                if (string.IsNullOrEmpty(type)) return BadRequest(ApiResponse.Fail("Type is required"));
                docs = await _repo.GetDocumentsAsync(type, type == "CaNhan" ? currentUserId : null, folderId);
                
                // For personal docs or shared, we might want to know if they are marked important by this user
                // Let's populate the important flag. This could be slow in a loop, but fine for now.
                // Ideally this should be a JOIN in GetDocumentsAsync, but keeping it simple.
                // For a robust implementation we can ignore this or add a bulk check.
            }

            return Ok(ApiResponse<List<Document>>.Ok(docs));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDocument(int id)
        {
            int currentUserId = GetCurrentUserId();
            var doc = await _repo.GetDocumentByIdAsync(id, currentUserId);
            if (doc == null) return NotFound(ApiResponse.Fail("Không tìm thấy tài liệu"));
            return Ok(ApiResponse<Document>.Ok(doc));
        }

        [HttpPost("upload")]
        [RequestSizeLimit(100_000_000)] // 100MB
        public async Task<IActionResult> UploadDocument([FromForm] IFormFile file, [FromForm] string? name, [FromForm] string? documentType, [FromForm] string? issuingAuthority, [FromForm] int? folderId, [FromForm] string? type)
        {
            if (file == null || file.Length == 0) return BadRequest(ApiResponse.Fail("Chưa chọn file"));
            if (string.IsNullOrEmpty(type)) return BadRequest(ApiResponse.Fail("Type is required"));

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "documents");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var ext = Path.GetExtension(file.FileName);
            var allowedExts = new[] { ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf" };
            if (!allowedExts.Contains(ext.ToLower()))
            {
                return BadRequest(ApiResponse.Fail("Định dạng file không được hỗ trợ. Chỉ cho phép doc, docx, xls, xlsx, ppt, pptx, pdf."));
            }

            var uniqueName = Guid.NewGuid().ToString() + ext;
            var filePath = Path.Combine(uploadsFolder, uniqueName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var doc = new Document
            {
                Name = string.IsNullOrEmpty(name) ? file.FileName : name,
                FileType = ext,
                FilePath = $"/uploads/documents/{uniqueName}",
                DocumentType = documentType,
                IssuingAuthority = issuingAuthority,
                FolderId = folderId,
                CreatorId = GetCurrentUserId(),
                Type = type
            };

            doc.Id = await _repo.InsertDocumentAsync(doc);
            return Ok(ApiResponse<Document>.Ok(doc));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var doc = await _repo.GetDocumentByIdAsync(id);
            if (doc == null) return NotFound(ApiResponse.Fail("Không tìm thấy tài liệu"));

            var success = await _repo.DeleteDocumentAsync(id);
            if (success)
            {
                // Delete physical file
                if (!string.IsNullOrEmpty(doc.FilePath))
                {
                    var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", doc.FilePath.TrimStart('/'));
                    if (System.IO.File.Exists(physicalPath))
                    {
                        System.IO.File.Delete(physicalPath);
                    }
                }
                return Ok(ApiResponse.Ok("Xóa tài liệu thành công"));
            }
            return BadRequest(ApiResponse.Fail("Lỗi khi xóa tài liệu"));
        }

        // ==========================================
        // IMPORTANT & SHARE
        // ==========================================

        [HttpPost("{id}/important")]
        public async Task<IActionResult> MarkImportant(int id)
        {
            int currentUserId = GetCurrentUserId();
            var doc = await _repo.GetDocumentByIdAsync(id);
            if (doc == null) return NotFound(ApiResponse.Fail("Không tìm thấy tài liệu"));

            await _repo.MarkAsImportantAsync(currentUserId, id);
            return Ok(ApiResponse.Ok("Đã đánh dấu quan trọng"));
        }

        [HttpPost("{id}/unimportant")]
        public async Task<IActionResult> UnmarkImportant(int id)
        {
            int currentUserId = GetCurrentUserId();
            await _repo.UnmarkAsImportantAsync(currentUserId, id);
            return Ok(ApiResponse.Ok("Đã bỏ đánh dấu quan trọng"));
        }

        [HttpPost("{id}/share")]
        public async Task<IActionResult> ShareDocument(int id, [FromBody] List<int> userIds)
        {
            int currentUserId = GetCurrentUserId();
            var doc = await _repo.GetDocumentByIdAsync(id);
            if (doc == null) return NotFound(ApiResponse.Fail("Không tìm thấy tài liệu"));

            foreach (var uId in userIds)
            {
                await _repo.ShareDocumentAsync(id, uId, currentUserId);
            }
            return Ok(ApiResponse.Ok("Chia sẻ thành công"));
        }

        [HttpDelete("{id}/share/{userId}")]
        public async Task<IActionResult> UnshareDocument(int id, int userId)
        {
            await _repo.UnshareDocumentAsync(id, userId);
            return Ok(ApiResponse.Ok("Hủy chia sẻ thành công"));
        }

        [HttpGet("{id}/shares")]
        public async Task<IActionResult> GetShares(int id)
        {
            var users = await _repo.GetDocumentSharesAsync(id);
            // using anonymous object mapping to avoid leaking password hashes in case User model has them
            var safeUsers = users.Select(u => new { u.Id, u.FullName, u.Username, u.DepartmentId });
            return Ok(ApiResponse<object>.Ok(safeUsers));
        }
    }
}
