using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System;
using Cabinet.Core.Models;

namespace Cabinet.Api.Controllers.Cabinet
{
    [Authorize] // Yêu cầu đăng nhập (sử dụng Token hoặc Cookie)
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        [HttpGet("download")]
        public IActionResult Download([FromQuery] string path)
        {
            if (string.IsNullOrWhiteSpace(path) || path.Contains(".."))
                return BadRequest(ApiResponse.Fail("Đường dẫn file không hợp lệ."));

            // Giải mã URL (nếu có)
            path = Uri.UnescapeDataString(path);
            
            // Xóa / ở đầu nếu có để Path.Combine an toàn
            path = path.TrimStart('/', '\\');

            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), path);

            if (!System.IO.File.Exists(physicalPath))
                return NotFound(ApiResponse.Fail("Không tìm thấy file."));

            // Lấy tên gốc (bỏ chuỗi GUID 32 ký tự ở đầu nếu có)
            var fileName = Path.GetFileName(physicalPath);
            var match = System.Text.RegularExpressions.Regex.Match(fileName, @"^[a-f0-9]{32}_(.*)$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (match.Success)
            {
                fileName = match.Groups[1].Value;
            }

            var provider = new Microsoft.AspNetCore.StaticFiles.FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(physicalPath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            return PhysicalFile(physicalPath, contentType, fileName);
        }
    }
}
