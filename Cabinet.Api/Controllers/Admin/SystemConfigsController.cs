using Cabinet.Core.Data.Repositories;
using Cabinet.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cabinet.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/configs")]
    public class SystemConfigsController : ControllerBase
    {
        private readonly ISystemConfigRepository _repo;

        public SystemConfigsController(ISystemConfigRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _repo.GetAllAsync();
            var dict = data.ToDictionary(x => x.KeyName, x => x.Value ?? "");
            return Ok(ApiResponse<Dictionary<string, string>>.Ok(dict));
        }

        [HttpPut]
        [Authorize] // Có thể thêm (Policy = "AdminOnly")
        public async Task<IActionResult> Update([FromBody] Dictionary<string, string> configs)
        {
            if (configs == null || !configs.Any())
                return BadRequest(ApiResponse.Fail("Không có dữ liệu cập nhật"));

            try
            {
                var ok = await _repo.UpdateConfigsAsync(configs);
                if (ok) return Ok(ApiResponse.Ok("Cập nhật cấu hình thành công"));
                return BadRequest(ApiResponse.Fail("Lỗi cập nhật cấu hình"));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse.Fail("Lỗi: " + ex.Message));
            }
        }
    }
}
