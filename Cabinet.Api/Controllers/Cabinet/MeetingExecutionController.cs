using Cabinet.Core.Data.Interfaces;
using Cabinet.Core.Models;
using Cabinet.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace Cabinet.Api.Controllers.Cabinet
{
    [Authorize]
    [ApiController]
    [Route("api/phonghopkhonggiayto/execution/meetings")]
    public class MeetingExecutionController : ControllerBase
    {
        private readonly IMeetingExecutionRepository _repo;
        private readonly IHubContext<NotificationHub> _hubContext;

        public MeetingExecutionController(IMeetingExecutionRepository repo, IHubContext<NotificationHub> hubContext)
        {
            _repo = repo;
            _hubContext = hubContext;
        }

        private int GetCurrentUserId()
        {
            var uidClaim = User.FindFirst("uid")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(uidClaim, out var uid) ? uid : 0;
        }

        // ================= SPEAKING REQUESTS =================

        [HttpGet("{meetingId}/speak-requests")]
        public async Task<IActionResult> GetSpeakingRequests(int meetingId)
        {
            var requests = await _repo.GetSpeakingRequestsAsync(meetingId);
            return Ok(ApiResponse<List<SpeakingRequest>>.Ok(requests));
        }

        [HttpPost("{meetingId}/speak-requests")]
        public async Task<IActionResult> RequestToSpeak(int meetingId)
        {
            var userId = GetCurrentUserId();
            var id = await _repo.CreateSpeakingRequestAsync(meetingId, userId);
            if (id == 0) return BadRequest(ApiResponse.Fail("Bạn đã gửi yêu cầu phát biểu rồi."));

            var req = await _repo.GetSpeakingRequestAsync(id);
            // Broadcast to meeting group
            await _hubContext.Clients.Group($"Meeting_{meetingId}").SendAsync("NewSpeakingRequest", req);
            
            return Ok(ApiResponse<SpeakingRequest>.Ok(req));
        }

        [HttpPut("{meetingId}/speak-requests/{id}")]
        public async Task<IActionResult> UpdateSpeakingRequestStatus(int meetingId, int id, [FromBody] UpdateStatusDto dto)
        {
            // Security: In a real app, verify the current user is the Presider/Admin
            var success = await _repo.UpdateSpeakingRequestStatusAsync(id, dto.Status);
            if (!success) return NotFound(ApiResponse.Fail("Không tìm thấy yêu cầu phát biểu."));

            var req = await _repo.GetSpeakingRequestAsync(id);
            await _hubContext.Clients.Group($"Meeting_{meetingId}").SendAsync("SpeakingRequestUpdated", req);

            return Ok(ApiResponse.Ok("Đã cập nhật trạng thái phát biểu."));
        }

        // ================= POLLS =================

        [HttpGet("{meetingId}/polls")]
        public async Task<IActionResult> GetPolls(int meetingId)
        {
            var polls = await _repo.GetPollsAsync(meetingId);
            return Ok(ApiResponse<List<MeetingPoll>>.Ok(polls));
        }

        [HttpPost("{meetingId}/polls")]
        public async Task<IActionResult> CreatePoll(int meetingId, [FromBody] CreatePollDto dto)
        {
            var userId = GetCurrentUserId();
            var pollId = await _repo.CreatePollAsync(meetingId, dto.Title, userId, dto.Options);
            var poll = await _repo.GetPollAsync(pollId);
            
            await _hubContext.Clients.Group($"Meeting_{meetingId}").SendAsync("NewPoll", poll);
            return Ok(ApiResponse<MeetingPoll>.Ok(poll));
        }

        [HttpPut("{meetingId}/polls/{pollId}/status")]
        public async Task<IActionResult> UpdatePollStatus(int meetingId, int pollId, [FromBody] UpdateStatusDto dto)
        {
            var success = await _repo.UpdatePollStatusAsync(pollId, dto.Status);
            if (!success) return NotFound(ApiResponse.Fail("Không tìm thấy biểu quyết."));

            var poll = await _repo.GetPollAsync(pollId);
            await _hubContext.Clients.Group($"Meeting_{meetingId}").SendAsync("PollUpdated", poll);
            
            return Ok(ApiResponse.Ok("Đã cập nhật biểu quyết."));
        }

        [HttpPost("{meetingId}/polls/{pollId}/vote")]
        public async Task<IActionResult> CastVote(int meetingId, int pollId, [FromBody] VoteDto dto)
        {
            var userId = GetCurrentUserId();
            var success = await _repo.CastVoteAsync(pollId, userId, dto.OptionId);
            if (!success) return BadRequest(ApiResponse.Fail("Bạn đã bình chọn rồi hoặc biểu quyết đã đóng."));

            // Broadcast the updated poll so everyone sees live results
            var poll = await _repo.GetPollAsync(pollId);
            await _hubContext.Clients.Group($"Meeting_{meetingId}").SendAsync("PollUpdated", poll);

            return Ok(ApiResponse.Ok("Bình chọn thành công."));
        }
        
        [HttpGet("{meetingId}/polls/{pollId}/my-vote")]
        public async Task<IActionResult> GetMyVote(int meetingId, int pollId)
        {
            var userId = GetCurrentUserId();
            var votes = await _repo.GetUserVotesAsync(pollId, userId);
            return Ok(ApiResponse<object>.Ok(new { OptionId = votes.FirstOrDefault()?.OptionId }));
        }

        // ================= COMMENTS =================

        [HttpGet("{meetingId}/comments")]
        public async Task<IActionResult> GetComments(int meetingId)
        {
            var comments = await _repo.GetCommentsAsync(meetingId);
            return Ok(ApiResponse<List<MeetingComment>>.Ok(comments));
        }

        [HttpPost("{meetingId}/comments")]
        public async Task<IActionResult> AddComment(int meetingId, [FromBody] CreateCommentDto dto)
        {
            var userId = GetCurrentUserId();
            var id = await _repo.AddCommentAsync(meetingId, userId, dto.Content);
            
            var comments = await _repo.GetCommentsAsync(meetingId);
            var comment = comments.FirstOrDefault(c => c.Id == id);
            
            await _hubContext.Clients.Group($"Meeting_{meetingId}").SendAsync("NewComment", comment);
            
            return Ok(ApiResponse<MeetingComment>.Ok(comment));
        }
    }

    // DTOs
    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty;
    }

    public class CreatePollDto
    {
        public string Title { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
    }

    public class VoteDto
    {
        public int OptionId { get; set; }
    }

    public class CreateCommentDto
    {
        public string Content { get; set; } = string.Empty;
    }
}
