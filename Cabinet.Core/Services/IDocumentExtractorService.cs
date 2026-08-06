using Cabinet.Models;

namespace Cabinet.Services
{
    public interface IDocumentExtractorService
    {
        Task<DocumentRecord> ExtractFromFileAsync(string filePath);
        Task<DocumentRecord> ExtractFromFileAsync(string filePath, OcrExtractionResult? ocrResult);
    }
}
