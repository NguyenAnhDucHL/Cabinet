using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Cabinet.Core.Data.Repositories;
using Cabinet.Core.Models;
using System.Text;

namespace Cabinet.Api.Controllers.Cabinet
{
    [Route("api/phonghopkhonggiayto/reports")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly IReportRepository _repo;

        public ReportsController(IReportRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var data = await _repo.GetOverviewStatsAsync();
            return Ok(ApiResponse.Ok(data));
        }

        [HttpGet("export-meetings")]
        public async Task<IActionResult> ExportMeetings([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            var data = await _repo.GetMeetingExportsAsync(startDate, endDate);
            return Ok(ApiResponse.Ok(data));
        }
    }
}
