using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text.Json;
using Cabinet.Core.Models;
using Cabinet.Models;
using Cabinet.Core.Data.Interfaces;
using Cabinet.Services;

namespace Cabinet.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class NotificationController : ControllerBase
    {
        private readonly IVapidService _vapidService;
        private readonly INotificationRepository _notificationRepo;

        public NotificationController(IVapidService vapidService, INotificationRepository notificationRepo)
        {
            _vapidService = vapidService;
            _notificationRepo = notificationRepo;
        }

        [HttpGet("vapid-public-key")]
        [AllowAnonymous]
        public IActionResult GetVapidPublicKey()
        {
            return Ok(ApiResponse.Ok(new { publicKey = _vapidService.GetVapidPublicKey() }));
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromBody] PushSubscriptionRequest request)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) 
                return Unauthorized(ApiResponse.Fail("Không tìm thấy người dùng."));

            var subscription = new PushSubscription
            {
                UserId = userId,
                Endpoint = request.Endpoint,
                P256dh = request.P256dh,
                Auth = request.Auth
            };

            await _notificationRepo.InsertPushSubscriptionAsync(subscription);
            return Ok(ApiResponse.Ok("Subscribed successfully"));
        }

        [HttpPost("test")]
        public async Task<IActionResult> TestNotification()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) 
                return Unauthorized(ApiResponse.Fail("Không tìm thấy người dùng."));

            var subscriptions = await _notificationRepo.GetPushSubscriptionsAsync(userId);
            if (!subscriptions.Any()) 
                return BadRequest(ApiResponse.Fail("Không tìm thấy đăng ký thông báo đẩy cho người dùng này."));

            var payload = JsonSerializer.Serialize(new NotificationPayload
            {
                Title = "Thông báo thử nghiệm",
                Body = "Hệ thống thông báo đẩy đã hoạt động!",
                Icon = "/assets/logo.png"
            });

            foreach (var sub in subscriptions)
            {
                await _vapidService.SendNotificationAsync(sub.Endpoint, sub.P256dh, sub.Auth, payload);
            }

            return Ok(ApiResponse.Ok($"Đã gửi tới {subscriptions.Count} thiết bị đăng ký."));
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) 
                return Unauthorized(ApiResponse.Fail("Không tìm thấy người dùng."));

            var list = await _notificationRepo.GetNotificationsAsync(userId);
            return Ok(ApiResponse.Ok(list));
        }

        [HttpPost("mark-read/{id}")]
        public async Task<IActionResult> MarkRead(int id)
        {
            await _notificationRepo.MarkNotificationAsReadAsync(id);
            return Ok(ApiResponse.Ok("Đã đánh dấu đã đọc."));
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllRead()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out int userId)) 
                return Unauthorized(ApiResponse.Fail("Không tìm thấy người dùng."));

            await _notificationRepo.MarkAllNotificationsAsReadAsync(userId);
            return Ok(ApiResponse.Ok("Đã đánh dấu đã đọc toàn bộ thông báo."));
        }
    }

    public class PushSubscriptionRequest
    {
        public string Endpoint { get; set; } = string.Empty;
        public string P256dh { get; set; } = string.Empty;
        public string Auth { get; set; } = string.Empty;
    }
}
