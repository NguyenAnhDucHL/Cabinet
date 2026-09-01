using Cabinet.Core.Data.Repositories;
using Cabinet.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cabinet.Api.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/[controller]")]
    [Authorize] // Có thể thêm (Policy = "AdminOnly") nếu cần
    public class PositionsController : ControllerBase
    {
        private readonly IPositionRepository _positionRepo;

        public PositionsController(IPositionRepository positionRepo)
        {
            _positionRepo = positionRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _positionRepo.GetAllAsync();
            return Ok(ApiResponse<List<Position>>.Ok(data));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _positionRepo.GetByIdAsync(id);
            if (data == null) return NotFound(ApiResponse.Fail("Không tìm thấy chức vụ"));
            return Ok(ApiResponse<Position>.Ok(data));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Position dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(ApiResponse.Fail("Tên chức vụ không được để trống"));

            try
            {
                var id = await _positionRepo.CreateAsync(dto);
                dto.Id = id;
                return Ok(ApiResponse<Position>.Ok(dto));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse.Fail("Lỗi khi tạo chức vụ: " + ex.Message));
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Position dto)
        {
            if (id != dto.Id) return BadRequest(ApiResponse.Fail("ID không khớp"));
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest(ApiResponse.Fail("Tên chức vụ không được để trống"));

            try
            {
                var ok = await _positionRepo.UpdateAsync(dto);
                if (!ok) return NotFound(ApiResponse.Fail("Không tìm thấy chức vụ"));
                return Ok(ApiResponse<Position>.Ok(dto));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse.Fail("Lỗi khi cập nhật: " + ex.Message));
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _positionRepo.DeleteAsync(id);
            if (!ok) return NotFound(ApiResponse.Fail("Không tìm thấy chức vụ"));
            return Ok(ApiResponse.Ok("Xóa chức vụ thành công"));
        }
    }
}
