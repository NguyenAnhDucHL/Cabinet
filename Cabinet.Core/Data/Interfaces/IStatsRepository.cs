using System;
using System.Collections.Generic;

namespace Cabinet.Core.Data.Interfaces
{
    public interface IStatsRepository
    {
        object GetDashboardStats();
        object GetDashboardDeadlineSeries(int days = 14);
        object GetMonthlyDepartmentReport(int month, int year);
    }
}
