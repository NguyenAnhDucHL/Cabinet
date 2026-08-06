namespace Cabinet.Services
{
    public interface IOcrImageProcessingService
    {
        string ExtractFromPdf(string filePath);
        string ExtractFromWord(string filePath);
    }
}
