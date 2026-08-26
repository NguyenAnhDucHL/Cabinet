namespace Cabinet.Core.Models
{
    public class MeetingFeedback
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public int UserId { get; set; }
        public string? ContentRef { get; set; }
        public string? DocumentRef { get; set; }
        public string Detail { get; set; } = "";
        public List<string> AttachmentPaths { get; set; } = new();
        public DateTime CreatedAt { get; set; }

        // Join fields
        public string? UserFullName { get; set; }
        public string? UserRole { get; set; }
    }
}
