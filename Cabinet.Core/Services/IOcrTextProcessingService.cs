using Cabinet.Models;

namespace Cabinet.Services
{
    public interface IOcrTextProcessingService
    {
        Task<DocumentRecord> ParseTextAsync(string text, string filePath, string ocrPagesJson = "[]");
    }
}
