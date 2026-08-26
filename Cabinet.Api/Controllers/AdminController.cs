using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cabinet.Core.Models;
using Cabinet.Models;
using Cabinet.Core.Data.Interfaces;

namespace Cabinet.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _adminRepo;
        private readonly IAuditLogRepository _auditLogRepo;

        public AdminController(IAdminRepository adminRepo, IAuditLogRepository auditLogRepo)
        {
            _adminRepo = adminRepo;
            _auditLogRepo = auditLogRepo;
        }

        // --- DEPARTMENTS ---
        [Authorize(Roles = "Admin,VanThu,LanhDao,CanBo")]
        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments() => Ok(ApiResponse.Ok(await _adminRepo.GetDepartmentsAsync()));

        [Authorize(Roles = "Admin")]
        [HttpPost("departments")]
        public async Task<IActionResult> AddDepartment([FromBody] Department dept)
        {
            if (dept == null) return BadRequest(ApiResponse.Fail("Dữ liệu phòng ban không hợp lệ."));
            int id = await _adminRepo.InsertDepartmentAsync(dept);
            dept.Id = id;
            return Ok(ApiResponse.Ok(dept));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("departments")]
        public async Task<IActionResult> UpdateDepartment([FromBody] Department dept)
        {
            if (dept == null) return BadRequest(ApiResponse.Fail("Dữ liệu phòng ban không hợp lệ."));
            await _adminRepo.UpdateDepartmentAsync(dept);
            return Ok(ApiResponse.Ok(dept));
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("departments/{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            await _adminRepo.DeleteDepartmentAsync(id);
            return Ok(ApiResponse.Ok("Xóa phòng ban thành công."));
        }



        [Authorize(Roles = "Admin")]
        [HttpGet("audit-logs")]
        public async Task<IActionResult> GetAuditLogs([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
        {
            var result = await _auditLogRepo.GetAuditLogsAsync(page, pageSize);
            return Ok(ApiResponse.Ok(new { items = result.items, total = result.total }));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("clear-audit-logs")]
        public async Task<IActionResult> ClearAuditLogs()
        {
            await _auditLogRepo.ClearAuditLogsAsync();
            await _auditLogRepo.InsertAuditLogAsync(null, "Quản trị viên đã dọn sạch toàn bộ nhật ký hệ thống.");
            return Ok(ApiResponse.Ok("Đã dọn sạch nhật ký hệ thống."));
        }
    }
}
