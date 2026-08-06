using Cabinet.Models;

namespace Cabinet.Services
{
    public interface IOcrService
    {
        Task<string> ExtractTextFromPdfOcrAsync(string filePath);
        Task<OcrExtractionResult> ExtractPdfOcrResultAsync(string filePath, OcrRunOptions? options = null);
    }
}
