namespace Cabinet.Models
{
    public class Questionnaire
    {
        public int Id { get; set; }
        public int MeetingId { get; set; }
        public string? MeetingTitle { get; set; }
        public string Title { get; set; } = string.Empty;
        
        // Cũ
        public int AssignedTo { get; set; }
        public string? AssignedToName { get; set; }
        
        // Mới
        public int? TemplateId { get; set; }
        public string? Type { get; set; }
        public List<string> AttachmentPaths { get; set; } = new();
        public string? Content { get; set; }
        public List<int> AssignedUserIds { get; set; } = new();

        public DateTime Deadline { get; set; }
        public string Status { get; set; } = "Chưa trả lời"; // Chưa trả lời, Đã trả lời, Hết hạn
        public DateTime CreatedAt { get; set; }
        public DateTime? SentAt { get; set; } // Thời điểm gửi phiếu
    }

    public class CreateQuestionnaireRequest
    {
        public int MeetingId { get; set; }
        public string Title { get; set; } = string.Empty;
        public int? TemplateId { get; set; }
        public string? Type { get; set; }
        public List<string> AttachmentPaths { get; set; } = new();
        public string? Content { get; set; }
        public List<int> AssignedUserIds { get; set; } = new();
        public DateTime Deadline { get; set; }
    }

    // --- DTOs cho tính năng xem chi tiết + trả lời ---

    public class QuestionnaireDetail
    {
        public Questionnaire Questionnaire { get; set; } = new();
        public List<QuestionnaireItemDetail> Items { get; set; } = new();
        public List<QuestionnaireResponseDetail> MyResponses { get; set; } = new();
        public bool HasResponded { get; set; }
    }

    public class QuestionnaireItemDetail
    {
        public int Id { get; set; }
        public string Content { get; set; } = string.Empty;
        public string ItemType { get; set; } = "Biểu quyết"; // Biểu quyết | Chọn một phương án
        public int OrderIndex { get; set; }
        public List<QuestionnaireOptionDetail> Options { get; set; } = new();
    }

    public class QuestionnaireOptionDetail
    {
        public int Id { get; set; }
        public string OptionText { get; set; } = string.Empty;
        public int OrderIndex { get; set; }
    }

    public class QuestionnaireResponseDetail
    {
        public int ItemId { get; set; }
        public int? SelectedOptionId { get; set; }
        public string? ResponseText { get; set; }
    }

    public class QuestionnaireResponseInput
    {
        public int ItemId { get; set; }
        public int? SelectedOptionId { get; set; }
        public string? ResponseText { get; set; }
    }

    public class SubmitResponseRequest
    {
        public List<QuestionnaireResponseInput> Responses { get; set; } = new();
    }
}
