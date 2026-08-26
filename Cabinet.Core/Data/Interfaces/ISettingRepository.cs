using System;

namespace Cabinet.Core.Data.Interfaces
{
    public interface ISettingRepository
    {
        Task<string> GetAppSettingAsync(string key, string defaultVal = "");
        Task SaveAppSettingAsync(string key, string val);
    }
}
