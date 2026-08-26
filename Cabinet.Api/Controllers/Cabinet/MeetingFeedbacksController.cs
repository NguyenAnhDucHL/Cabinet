using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cabinet.Core.Data.Repositories;
using Cabinet.Core.Models;

namespace Cabinet.Api.Controllers.Cabinet
{
    [Route("api/phonghopkhonggiayto/meetings/{meetingId}/feedbacks")]
    [ApiController]
    [Authorize]
    public class MeetingFeedbacksController : ControllerBase
    {
        private readonly IMeetingFeedbackRepository _repo;

        // Allowed file extensions for góp ý attachments
        private static readonly HashSet<string> AllowedExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf"
        };

        private const long MaxFileSizeBytes = 50 * 1024 * 1024; // 50MB

        public MeetingFeedbacksController(IMeetingFeedbackRepository repo)
        {
            _repo = repo;
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)
                ?? User.FindFirst("sub")
                ?? User.FindFirst("uid");
            return int.TryParse(claim?.Value, out var id) ? id : 0;
        }

        // GET /api/phonghopkhonggiayto/meetings/{meetingId}/feedbacks
        [HttpGet]
        public async Task<IActionResult> GetAll(int meetingId)
        {
            var feedbacks = await _repo.GetByMeetingIdAsync(meetingId);
            return Ok(ApiResponse<List<MeetingFeedback>>.Ok(feedbacks));
        }

        // POST /api/phonghopkhonggiayto/meetings/{meetingId}/feedbacks
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> Create(
            int meetingId,
            [FromForm] string detail,
            [FromForm] string? contentRef,
            [FromForm] string? documentRef,
            [FromForm] List<IFormFile>? attachments)
        {
            if (string.IsNullOrWhiteSpace(detail))
                return BadRequest(ApiResponse.Fail("Chi tiết góp ý không được để trống."));

            var userId = GetCurrentUserId();
            if (userId == 0)
                return Unauthorized(ApiResponse.Fail("Không xác định được người dùng."));

            // Upload files
            var savedPaths = new List<string>();
            if (attachments != null && attachments.Count > 0)
            {
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Cabinet", "Feedbacks");
                Directory.CreateDirectory(uploadDir);

                foreach (var file in attachments)
                {
                    if (file.Length == 0) continue;

                    // Validate size
                    if (file.Length > MaxFileSizeBytes)
                        return BadRequest(ApiResponse.Fail($"File '{file.FileName}' vượt quá 50MB."));

                    // Validate extension
                    var ext = Path.GetExtension(file.FileName);
                    if (!AllowedExtensions.Contains(ext))
                        return BadRequest(ApiResponse.Fail($"Định dạng file '{ext}' không được phép. Chỉ chấp nhận: .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf"));

                    var safeFileName = $"{Guid.NewGuid():N}_{Path.GetFileName(file.FileName)}";
                    var filePath = Path.Combine(uploadDir, safeFileName);
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await file.CopyToAsync(stream);
                    savedPaths.Add($"Uploads/Cabinet/Feedbacks/{safeFileName}");
                }
            }

            var feedback = new MeetingFeedback
            {
                MeetingId = meetingId,
                UserId = userId,
                ContentRef = contentRef,
                DocumentRef = documentRef,
                Detail = detail.Trim(),
                AttachmentPaths = savedPaths,
            };

            var newId = await _repo.CreateAsync(feedback);
            feedback.Id = newId;

            return Ok(ApiResponse<MeetingFeedback>.Ok(feedback, "Góp ý đã được ghi nhận thành công."));
        }

        // DELETE /api/phonghopkhonggiayto/meetings/{meetingId}/feedbacks/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int meetingId, int id)
        {
            var success = await _repo.DeleteAsync(id);
            if (!success)
                return NotFound(ApiResponse.Fail("Không tìm thấy góp ý."));
            return Ok(ApiResponse.Ok("Đã xóa góp ý."));
        }
    }
}
