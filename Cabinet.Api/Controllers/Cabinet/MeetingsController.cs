using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cabinet.Core.Data.Repositories;
using System.Text.Json;
using System.IO;
using Microsoft.AspNetCore.Http;
using Cabinet.Core.Models;
using Cabinet.Models;
using Microsoft.AspNetCore.SignalR;
using Cabinet.Hubs;

namespace Cabinet.Api.Controllers.Cabinet
{
    public record UpdateAttendanceRequest(string Status);
    public record ReportAbsenceRequest(string Reason, int? SubstituteUserId);
    public record ApproveAbsenceRequest(bool Approve);
    public record SyncScreenRequest(string DocumentUrl, int PageNumber, string TabName);

    [Route("api/phonghopkhonggiayto/meetings")]
    [ApiController]
    [Authorize]
    public class MeetingsController : ControllerBase
    {
        private readonly IMeetingRepository _meetingRepo;
        private readonly IRoomRepository _roomRepo;
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IQuestionnaireRepository _questionnaireRepo;

        public MeetingsController(IMeetingRepository meetingRepo, IRoomRepository roomRepo, IHubContext<NotificationHub> hubContext, IQuestionnaireRepository questionnaireRepo)
        {
            _meetingRepo = meetingRepo;
            _roomRepo = roomRepo;
            _hubContext = hubContext;
            _questionnaireRepo = questionnaireRepo;
        }


        private int GetCurrentUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)
                ?? User.FindFirst("sub")
                ?? User.FindFirst("id");
            return int.TryParse(claim?.Value, out var id) ? id : 0;
        }

        // GET /api/phonghopkhonggiayto/meetings/schedule
        [HttpGet("schedule")]
        public async Task<IActionResult> GetSchedule()
        {
            var meetings = await _meetingRepo.GetAllAsync();
            return Ok(ApiResponse.Ok(meetings));
        }

        // GET /api/phonghopkhonggiayto/meetings/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var meeting = await _meetingRepo.GetByIdAsync(id);
            if (meeting == null)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiên họp."));
            return Ok(ApiResponse.Ok(meeting));
        }

        // GET /api/phonghopkhonggiayto/meetings/{id}/export
        [HttpGet("{id}/export")]
        public async Task<IActionResult> Export(int id)
        {
            var meeting = await _meetingRepo.GetByIdAsync(id);
            if (meeting == null)
                return NotFound("Không tìm thấy phiên họp.");

            var questionnaires = await _questionnaireRepo.GetAllByMeetingIdAsync(id);

            var html = $@"<html>
<head>
    <meta charset='utf-8'>
    <title>Báo cáo phiên họp</title>
    <style>
        body {{ font-family: Arial, sans-serif; padding: 20px; }}
        table {{ border-collapse: collapse; width: 100%; margin-bottom: 20px; }}
        th, td {{ border: 1px solid #ccc; padding: 8px; text-align: left; }}
        th {{ background-color: #f5f5f5; font-weight: bold; }}
        h2, h3 {{ color: #333; }}
        .text-center {{ text-align: center; }}
    </style>
</head>
<body>
    <h2 class='text-center'>BÁO CÁO PHIÊN HỌP</h2>
    <table>
        <tr><th width='200'>Tên phiên họp</th><td>{meeting.Title}</td></tr>
        <tr><th>Thời gian</th><td>{(meeting.StartTime != DateTime.MinValue ? meeting.StartTime.ToString("dd/MM/yyyy HH:mm") : "")} - {(meeting.EndTime != DateTime.MinValue ? meeting.EndTime.ToString("HH:mm") : "")}</td></tr>
        <tr><th>Địa điểm</th><td>{meeting.Location ?? "Phòng trực tuyến"}</td></tr>
        <tr><th>Chủ trì</th><td>{meeting.Presider}</td></tr>
        <tr><th>Đơn vị chuẩn bị</th><td>{meeting.PreparingUnit}</td></tr>
        <tr><th>Trạng thái</th><td>{meeting.Status}</td></tr>
    </table>

    <h3>1. Danh sách tham dự</h3>
    <table>
        <tr>
            <th width='50'>STT</th>
            <th>Tên thành viên</th>
            <th>Vai trò</th>
            <th>Trạng thái tham dự</th>
            <th>Lý do vắng mặt</th>
            <th>Người đi thay</th>
        </tr>";

            int stt = 1;
            int presentCount = 0;
            int absentCount = 0;
            foreach(var p in meeting.Participants)
            {
                var isAbsent = p.AttendanceStatus == "Vắng mặt" || p.AttendanceStatus == "Báo vắng";
                if (isAbsent) absentCount++;
                else presentCount++;

                html += $@"<tr>
            <td>{stt++}</td>
            <td>{p.UserFullName}</td>
            <td>{p.UserRole}</td>
            <td>{p.AttendanceStatus}</td>
            <td>{p.AbsenceReason}</td>
            <td>{(p.SubstituteUserId.HasValue ? "Có" : "")}</td>
        </tr>";
            }

            html += $@"
    </table>
    <p><strong>Thống kê:</strong> Tổng: {meeting.Participants.Count}, Tham dự: {presentCount}, Vắng mặt: {absentCount}</p>

    <h3>2. Nội dung phiên họp</h3>
    <p>{meeting.Content?.Replace("\n", "<br>") ?? "Không có nội dung"}</p>

    <h3>3. Phiếu lấy ý kiến & Biểu quyết</h3>
    <table>
        <tr>
            <th width='50'>STT</th>
            <th>Tên phiếu</th>
            <th>Trạng thái</th>
            <th>Ngày hạn</th>
            <th>Tỉ lệ hoàn thành</th>
        </tr>";

            int qStt = 1;
            foreach(var q in questionnaires)
            {
                // Thống kê kết quả có thể chi tiết hơn, nhưng tạm thời xuất danh sách phiếu.
                html += $@"<tr>
            <td>{qStt++}</td>
            <td>{q.Title}</td>
            <td>{q.Status}</td>
            <td>{(q.Deadline != DateTime.MinValue ? q.Deadline.ToString("dd/MM/yyyy") : "")}</td>
            <td>-</td>
        </tr>";
            }

            html += @"
    </table>
</body>
</html>";

            var bytes = System.Text.Encoding.UTF8.GetBytes(html);
            var fileName = $"BaoCao_PhienHop_{id}.xls";
            return File(bytes, "application/vnd.ms-excel", fileName);
        }


        // GET /api/phonghopkhonggiayto/meetings/my-meetings
        // Lấy danh sách phiên họp mà user hiện tại được mời tham dự (kèm trạng thái tham dự)
        [HttpGet("my-meetings")]
        public async Task<IActionResult> GetMyMeetings()
        {
            var userId = GetCurrentUserId();
            var meetings = await _meetingRepo.GetByParticipantAsync(userId);
            return Ok(ApiResponse.Ok(meetings));
        }

        // GET /api/phonghopkhonggiayto/meetings/dashboard
        [HttpGet("dashboard")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var userId = GetCurrentUserId();
            var all = await _meetingRepo.GetAllAsync();
            var myMeetings = await _meetingRepo.GetByParticipantAsync(userId);
            var now = DateTime.UtcNow.AddHours(7);

            // Tự động cập nhật trạng thái theo thời gian thực
            var ongoing = all.Where(m => m.StartTime <= now && m.EndTime >= now && m.Status != "Hủy").ToList();
            var upcoming = all.Where(m => m.StartTime > now && m.Status == "Sắp diễn ra").ToList();
            var today = all.Where(m => m.StartTime.Date == now.Date && m.Status != "Hủy").ToList();

            // Thống kê tham dự thực từ DB
            var confirmed = myMeetings.Count(m =>
                m.Participants.FirstOrDefault()?.AttendanceStatus == "Có tham gia");
            var unconfirmed = myMeetings.Count(m =>
                m.Participants.FirstOrDefault()?.AttendanceStatus is "Chưa xác nhận" or null);

            var stats = new
            {
                UpcomingCount = upcoming.Count,
                OngoingCount = ongoing.Count,
                TodayCount = today.Count,
                TotalThisMonth = all.Count(m => m.StartTime.Month == now.Month && m.StartTime.Year == now.Year),
                UpcomingMeetings = upcoming.Take(5),
                OngoingMeetings = ongoing,
                Participation = new
                {
                    Confirmed = confirmed,
                    Unconfirmed = unconfirmed
                }
            };

            return Ok(ApiResponse.Ok(stats));
        }

        // PUT /api/phonghopkhonggiayto/meetings/{id}/attendance
        // Cập nhật trạng thái tham dự của user hiện tại
        [HttpPut("{id}/attendance")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] UpdateAttendanceRequest request)
        {
            var userId = GetCurrentUserId();
            if (string.IsNullOrWhiteSpace(request.Status))
                return BadRequest(ApiResponse.Fail("Trạng thái không hợp lệ."));

            var allowedStatuses = new[] { "Có tham gia", "Chưa xác nhận", "Vắng mặt" };
            if (!allowedStatuses.Contains(request.Status))
                return BadRequest(ApiResponse.Fail($"Trạng thái phải là: {string.Join(", ", allowedStatuses)}"));

            var success = await _meetingRepo.UpdateAttendanceAsync(id, userId, request.Status);
            if (!success)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiên họp hoặc bạn không được mời tham dự."));

            // Broadcast real-time event to Meeting Group
            await _hubContext.Clients.Group($"Meeting_{id}").SendAsync("AttendanceUpdated", new { UserId = userId, Status = request.Status });

            return Ok(ApiResponse.Ok(null, $"Đã cập nhật trạng thái tham dự thành '{request.Status}'."));
        }

        // POST /api/phonghopkhonggiayto/meetings/{id}/sync-screen
        [HttpPost("{id}/sync-screen")]
        public async Task<IActionResult> SyncScreen(int id, [FromBody] SyncScreenRequest req)
        {
            var meeting = await _meetingRepo.GetByIdAsync(id);
            if (meeting == null)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiên họp."));

            // Broadcast real-time event to Meeting Group
            await _hubContext.Clients.Group($"Meeting_{id}").SendAsync("ScreenSynced", req);

            return Ok(ApiResponse.Ok(null, "Đã gửi tín hiệu đồng bộ màn hình."));
        }

        // POST /api/phonghopkhonggiayto/meetings
        [HttpPost]
        public async Task<IActionResult> CreateMeeting([FromForm] string requestJson, [FromForm] List<IFormFile>? programFiles, [FromForm] List<IFormFile>? invitationFiles)
        {
            CreateMeetingRequest? request;
            try
            {
                request = JsonSerializer.Deserialize<CreateMeetingRequest>(requestJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (request == null) return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ."));
            }
            catch
            {
                return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ."));
            }

            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest(ApiResponse.Fail("Tên phiên họp không được để trống."));

            if (request.EndTime <= request.StartTime)
                return BadRequest(ApiResponse.Fail("Thời gian kết thúc phải sau thời gian bắt đầu."));

            if (request.RoomId.HasValue)
            {
                var room = await _roomRepo.GetByIdAsync(request.RoomId.Value);
                if (room == null)
                    return BadRequest(ApiResponse.Fail("Phòng họp không tồn tại."));
                if (room.Status == 0)
                    return BadRequest(ApiResponse.Fail("Phòng họp đang không hoạt động."));
            }
            else
            {
                if (string.IsNullOrWhiteSpace(request.Location))
                    return BadRequest(ApiResponse.Fail("Vui lòng nhập tên/địa điểm phòng họp khác."));
            }

            try
            {
                var newProgramFiles = await HandleFileUploads(programFiles);
                if (newProgramFiles.Count > 0)
                {
                    request.ProgramFilePaths ??= new List<string>();
                    request.ProgramFilePaths.AddRange(newProgramFiles);
                }

                var newInvitationFiles = await HandleFileUploads(invitationFiles);
                if (newInvitationFiles.Count > 0)
                {
                    request.InvitationFilePaths ??= new List<string>();
                    request.InvitationFilePaths.AddRange(newInvitationFiles);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse.Fail($"Lỗi khi tải file lên: {ex.Message}"));
            }

            var creatorId = GetCurrentUserId();
            var newId = await _meetingRepo.CreateAsync(request, creatorId);
            var created = await _meetingRepo.GetByIdAsync(newId);

            await _hubContext.Clients.All.SendAsync("MeetingUpdated");

            return Ok(ApiResponse.Ok(created, "Tạo phiên họp thành công."));
        }

        // PUT /api/phonghopkhonggiayto/meetings/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMeeting(int id, [FromForm] string requestJson, [FromForm] List<IFormFile>? programFiles, [FromForm] List<IFormFile>? invitationFiles)
        {
            CreateMeetingRequest? request;
            try
            {
                request = JsonSerializer.Deserialize<CreateMeetingRequest>(requestJson, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                if (request == null) return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ."));
            }
            catch
            {
                return BadRequest(ApiResponse.Fail("Dữ liệu không hợp lệ."));
            }

            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest(ApiResponse.Fail("Tên phiên họp không được để trống."));

            if (request.EndTime <= request.StartTime)
                return BadRequest(ApiResponse.Fail("Thời gian kết thúc phải sau thời gian bắt đầu."));

            try
            {
                var newProgramFiles = await HandleFileUploads(programFiles);
                if (newProgramFiles.Count > 0)
                {
                    request.ProgramFilePaths ??= new List<string>();
                    request.ProgramFilePaths.AddRange(newProgramFiles);
                }

                var newInvitationFiles = await HandleFileUploads(invitationFiles);
                if (newInvitationFiles.Count > 0)
                {
                    request.InvitationFilePaths ??= new List<string>();
                    request.InvitationFilePaths.AddRange(newInvitationFiles);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse.Fail($"Lỗi khi tải file lên: {ex.Message}"));
            }


            var success = await _meetingRepo.UpdateAsync(id, request);
            if (!success)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiên họp."));

            var updated = await _meetingRepo.GetByIdAsync(id);
            await _hubContext.Clients.All.SendAsync("MeetingUpdated");
            
            return Ok(ApiResponse.Ok(updated, "Cập nhật phiên họp thành công."));
        }

        private async Task<List<string>> HandleFileUploads(List<IFormFile>? files)
        {
            var savedPaths = new List<string>();
            if (files != null && files.Count > 0)
            {
                var uploadDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads", "Cabinet", "Meetings");
                Directory.CreateDirectory(uploadDir);

                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        var safeFileName = $"{Guid.NewGuid():N}_{Path.GetFileName(file.FileName)}";
                        var filePath = Path.Combine(uploadDir, safeFileName);
                        using var stream = new FileStream(filePath, FileMode.Create);
                        await file.CopyToAsync(stream);
                        savedPaths.Add($"Uploads/Cabinet/Meetings/{safeFileName}");
                    }
                }
            }
            return savedPaths;
        }

        // PUT /api/phonghopkhonggiayto/meetings/{id}/cancel
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelMeeting(int id)
        {
            var success = await _meetingRepo.CancelAsync(id);
            if (!success)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiên họp."));
                
            await _hubContext.Clients.All.SendAsync("MeetingUpdated");
            return Ok(ApiResponse.Ok(null, "Đã hủy phiên họp."));
        }

        // POST /api/phonghopkhonggiayto/meetings/{id}/send-invitation
        [HttpPost("{id}/send-invitation")]
        public async Task<IActionResult> SendInvitation(int id)
        {
            var meeting = await _meetingRepo.GetByIdAsync(id);
            if (meeting == null)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiên họp."));

            var success = await _meetingRepo.SendInvitationAsync(id);
            if (!success)
                return BadRequest(ApiResponse.Fail("Không thể gửi lịch họp."));

            // Gửi thông báo SignalR đến tất cả thành viên được mời
            await _hubContext.Clients.All.SendAsync("MeetingUpdated");
            return Ok(ApiResponse.Ok(null, $"Đã gửi lịch họp '{meeting.Title}' đến {meeting.Participants.Count} thành viên."));
        }

        // PUT /api/phonghopkhonggiayto/meetings/{id}/report-absence
        [HttpPut("{id}/report-absence")]
        public async Task<IActionResult> ReportAbsence(int id, [FromBody] ReportAbsenceRequest req)
        {
            var userId = GetCurrentUserId();
            var success = await _meetingRepo.ReportAbsenceAsync(id, userId, req.Reason, req.SubstituteUserId);
            if (!success)
                return BadRequest(ApiResponse.Fail("Không thể báo vắng. Bạn có thể không trong danh sách tham dự."));
            return Ok(ApiResponse.Ok(null, "Đã gửi báo cáo vắng mặt. Chờ chủ trì phê duyệt."));
        }

        // PUT /api/phonghopkhonggiayto/meetings/{id}/approve-absence/{userId}
        [HttpPut("{id}/approve-absence/{targetUserId}")]
        public async Task<IActionResult> ApproveAbsence(int id, int targetUserId, [FromBody] ApproveAbsenceRequest req)
        {
            var success = await _meetingRepo.ApproveAbsenceAsync(id, targetUserId, req.Approve);
            if (!success)
                return BadRequest(ApiResponse.Fail("Không thể cập nhật trạng thái."));
            var msg = req.Approve ? "Đã phê duyệt báo vắng." : "Đã từ chối báo vắng.";
            return Ok(ApiResponse.Ok(null, msg));
        }

        // DELETE /api/phonghopkhonggiayto/meetings/{id}
        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireAdminOrLanhDao")]
        public async Task<IActionResult> DeleteMeeting(int id)
        {
            var success = await _meetingRepo.DeleteAsync(id);
            if (!success)
                return NotFound(ApiResponse.Fail("Không tìm thấy phiên họp."));

            await _hubContext.Clients.All.SendAsync("MeetingUpdated");
            return Ok(ApiResponse.Ok(null, "Đã xóa phiên họp."));
        }
    }
}
