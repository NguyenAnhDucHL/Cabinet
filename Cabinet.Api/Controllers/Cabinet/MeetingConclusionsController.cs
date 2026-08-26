using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cabinet.Core.Data.Repositories;
using Cabinet.Core.Models;
using Cabinet.Models;
using Cabinet.Services;

namespace Cabinet.Api.Controllers.Cabinet
{
    [Route("api/phonghopkhonggiayto/conclusions")]
    [ApiController]
    [Authorize]
    public class MeetingConclusionsController : ControllerBase
    {
        private readonly IMeetingConclusionRepository _repo;
        private readonly IMeetingRepository _meetingRepo;
        private readonly INotificationManager _notificationManager;

        public MeetingConclusionsController(
            IMeetingConclusionRepository repo, 
            IMeetingRepository meetingRepo,
            INotificationManager notificationManager)
        {
            _repo = repo;
            _meetingRepo = meetingRepo;
            _notificationManager = notificationManager;
        }

        // GET /api/phonghopkhonggiayto/conclusions?search=...&page=1&pageSize=10
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? search,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var items = await _repo.GetAllAsync(search, page, pageSize);
            var total = await _repo.CountAllAsync(search);
            return Ok(ApiResponse.Ok(new { items, total, page, pageSize }));
        }

        // GET /api/phonghopkhonggiayto/conclusions/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _repo.GetByIdAsync(id);
            if (item == null) return NotFound(ApiResponse.Fail("Không tìm thấy kết luận."));
            return Ok(ApiResponse.Ok(item));
        }

        // POST /api/phonghopkhonggiayto/conclusions
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateConclusionRequest request)
        {
            if (request.MeetingId <= 0)
                return BadRequest(ApiResponse.Fail("Cần chọn phiên họp."));

            var newId = await _repo.CreateAsync(request);
            var created = await _repo.GetByIdAsync(newId);
            return Ok(ApiResponse.Ok(created, "Tạo kết luận thành công."));
        }

        // PUT /api/phonghopkhonggiayto/conclusions/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateConclusionRequest request)
        {
            var success = await _repo.UpdateAsync(id, request);
            if (!success) return NotFound(ApiResponse.Fail("Không tìm thấy kết luận."));
            var updated = await _repo.GetByIdAsync(id);

            // Send notification
            if (updated != null && (request.Status == "Đã xử lý" || request.Progress == 100))
            {
                var meeting = await _meetingRepo.GetByIdAsync(updated.MeetingId);
                if (meeting != null && meeting.Participants != null)
                {
                    var msg = $"Kết luận của phiên họp '{meeting.Title}' đã được cập nhật.";
                    foreach (var p in meeting.Participants)
                    {
                        await _notificationManager.SendToUserAsync(p.UserId, "Kết luận phiên họp", msg, new { meetingId = meeting.Id });
                    }
                }
            }

            return Ok(ApiResponse.Ok(updated, "Cập nhật kết luận thành công."));
        }

        // DELETE /api/phonghopkhonggiayto/conclusions/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,LanhDao")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repo.DeleteAsync(id);
            if (!success) return NotFound(ApiResponse.Fail("Không tìm thấy kết luận."));
            return Ok(ApiResponse.Ok(null, "Đã xóa kết luận."));
        }
    }
}
