using System.Collections.Generic;
using Cabinet.Models;

namespace Cabinet.Core.Data.Interfaces
{
    public interface IAdminRepository
    {
        Task<List<Department>> GetDepartmentsAsync();
        Task<int> InsertDepartmentAsync(Department dept);
        Task UpdateDepartmentAsync(Department dept);
        Task DeleteDepartmentAsync(int id);
    }
}
