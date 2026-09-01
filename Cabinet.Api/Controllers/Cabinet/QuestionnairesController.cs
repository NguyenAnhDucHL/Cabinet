using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cabinet.Core.Data.Repositories;
using Cabinet.Core.Models;
using Cabinet.Models;
using Microsoft.AspNetCore.SignalR;
using Cabinet.Hubs;

namespace Cabinet.Api.Controllers.Cabinet
{
    [Route("api/phonghopkhonggiayto/questionnaires")]
    [ApiController]
    [Authorize]
    public class QuestionnairesController : ControllerBase
    {
        private readonly IQuestionnaireRepository _repo;
        private readonly IHubContext<NotificationHub> _hubContext;

        public QuestionnairesController(IQuestionnaireRepository repo, IHubContext<NotificationHub> hubContext)
        {
            _repo = repo;
            _hubContext = hubContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestionnaires([FromQuery] string? status = null)
        {
            var data = await _repo.GetAllAsync(status);
            return Ok(ApiResponse.Ok(data));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] string title, [FromForm] int? templateId, 
            [FromForm] string? type, [FromForm] string? content, [FromForm] string? assignedUserIdsStr, 
            [FromForm] DateTime deadline, [FromForm] List<IFormFile>? files)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest(ApiResponse.Fail("Tên phiếu không được để trống."));

            var savedPaths = new List<string>();

            // Handle file uploads (save to Uploads/questionnaires/)
            if (files != null && files.Count > 0)
            {
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Cabinet", "Questionnaires");
                Directory.CreateDirectory(uploadDir);

                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        var safeFileName = $"{Guid.NewGuid():N}_{Path.GetFileName(file.FileName)}";
                        var filePath = Path.Combine(uploadDir, safeFileName);
                        using var stream = new FileStream(filePath, FileMode.Create);
                        await file.CopyToAsync(stream);
                        savedPaths.Add($"Uploads/Cabinet/Questionnaires/{safeFileName}");
                    }
                }
            }

            var assignedUsers = new List<int>();
            if (!string.IsNullOrEmpty(assignedUserIdsStr))
            {
                try {
                    assignedUsers = System.Text.Json.JsonSerializer.Deserialize<List<int>>(assignedUserIdsStr) ?? new List<int>();
                } catch {
                    // Ignore parse errors, maybe they sent comma separated string?
                }
            }

            var req = new CreateQuestionnaireRequest
            {
                MeetingId = 0, // Placeholder if no meeting context
                Title = title,
                TemplateId = templateId,
                Type = type,
                Content = content,
                AssignedUserIds = assignedUsers,
                Deadline = deadline,
                AttachmentPaths = savedPaths
            };

            var newId = await _repo.CreateAsync(req);
            return Ok(ApiResponse.Ok(newId, "Tạo phiếu lấy ý kiến thành công."));
        }

        // POST /api/phonghopkhonggiayto/questionnaires/{id}/send
        [HttpPost("{id}/send")]
        public async Task<IActionResult> Send(int id)
        {
            var userId = GetCurrentUserId();
            var detail = await _repo.GetDetailAsync(id, userId);
            if (detail == null)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiếu."));

            var success = await _repo.SendAsync(id);
            if (!success)
                return BadRequest(ApiResponse.Fail("Không thể gửi phiếu. Phiếu có thể đã được gửi trước đó."));

            await _hubContext.Clients.Group($"Meeting_{detail.Questionnaire.MeetingId}").SendAsync("QuestionnaireSent");
            
            return Ok(ApiResponse.Ok(null, "Đã gửi phiếu lấy ý kiến đến các thành viên."));
        }

        // GET /api/phonghopkhonggiayto/questionnaires/my
        [HttpGet("my")]
        public async Task<IActionResult> GetMyAssigned()
        {
            var userId = GetCurrentUserId();
            var data = await _repo.GetMyAssignedAsync(userId);
            return Ok(ApiResponse.Ok(data));
        }

        // GET /api/phonghopkhonggiayto/questionnaires/{id}/detail
        [HttpGet("{id}/detail")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var userId = GetCurrentUserId();
            var detail = await _repo.GetDetailAsync(id, userId);
            if (detail == null)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiếu lấy ý kiến."));
            return Ok(ApiResponse.Ok(detail));
        }

        // POST /api/phonghopkhonggiayto/questionnaires/{id}/respond
        [HttpPost("{id}/respond")]
        public async Task<IActionResult> Respond(int id, [FromBody] SubmitResponseRequest req)
        {
            var userId = GetCurrentUserId();
            var detail = await _repo.GetDetailAsync(id, userId);
            if (detail == null)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiếu."));

            var success = await _repo.SubmitResponseAsync(id, userId, req.Responses);
            if (!success)
                return BadRequest(ApiResponse.Fail("Không thể lưu câu trả lời."));

            await _hubContext.Clients.Group($"Meeting_{detail.Questionnaire.MeetingId}").SendAsync("QuestionnaireResponded");
            
            return Ok(ApiResponse.Ok(null, "Đã gửi câu trả lời thành công."));
        }

        // DELETE /api/phonghopkhonggiayto/questionnaires/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repo.DeleteAsync(id);
            if (!success)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiếu lấy ý kiến."));
            return Ok(ApiResponse.Ok(null, "Đã xóa phiếu lấy ý kiến."));
        }

        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)
                ?? User.FindFirst("sub")
                ?? User.FindFirst("id");
            return int.TryParse(claim?.Value, out var id) ? id : 0;
        }
    }
}
