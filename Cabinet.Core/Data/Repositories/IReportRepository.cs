namespace Cabinet.Core.Data.Repositories
{
    public interface IReportRepository
    {
        Task<object> GetOverviewStatsAsync();
        Task<List<object>> GetMeetingExportsAsync(DateTime? startDate, DateTime? endDate);
    }
}
