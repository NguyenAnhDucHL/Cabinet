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

        // GET /api/phonghopkhonggiayto/conclusions/export?search=...
        [HttpGet("export")]
        public async Task<IActionResult> Export([FromQuery] string? search)
        {
            // Lấy tối đa 1000 kết luận để xuất báo cáo
            var items = await _repo.GetAllAsync(search, 1, 1000);
            var html = $@"<html>
<head>
    <meta charset='utf-8'>
    <title>Danh sách nghị quyết, kết luận</title>
    <style>
        body {{ font-family: Arial, sans-serif; padding: 20px; }}
        table {{ border-collapse: collapse; width: 100%; margin-bottom: 20px; }}
        th, td {{ border: 1px solid #ccc; padding: 8px; text-align: left; }}
        th {{ background-color: #f5f5f5; font-weight: bold; }}
        h2 {{ color: #333; text-align: center; }}
    </style>
</head>
<body>
    <h2>DANH SÁCH NGHỊ QUYẾT, KẾT LUẬN</h2>
    <table>
        <tr>
            <th width='50'>STT</th>
            <th>Số văn bản</th>
            <th>Ngày ban hành</th>
            <th>Tên phiên họp</th>
            <th>File kết luận</th>
            <th>Trạng thái</th>
            <th>Tiến độ</th>
        </tr>";

            int stt = 1;
            foreach(var item in items)
            {
                html += $@"<tr>
            <td>{stt++}</td>
            <td>{item.DocumentNumber}</td>
            <td>{(item.DocumentDate.HasValue ? item.DocumentDate.Value.ToString("dd/MM/yyyy") : "")}</td>
            <td>{item.MeetingTitle}</td>
            <td>{item.FileName}</td>
            <td>{item.Status}</td>
            <td>{item.Progress}%</td>
        </tr>";
            }

            html += @"
    </table>
</body>
</html>";

            var bytes = System.Text.Encoding.UTF8.GetBytes(html);
            var fileName = $"DanhSachKetLuan_{DateTime.Now:yyyyMMdd_HHmm}.xls";
            return File(bytes, "application/vnd.ms-excel", fileName);
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
