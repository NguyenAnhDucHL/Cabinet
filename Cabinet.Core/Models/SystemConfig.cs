namespace Cabinet.Core.Models
{
    public class SystemConfig
    {
        public int Id { get; set; }
        public string KeyName { get; set; } = string.Empty;
        public string? Value { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
