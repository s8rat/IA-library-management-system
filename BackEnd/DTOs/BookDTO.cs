namespace BackEnd.DTOs
{
    public class BookDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string? ISBN { get; set; }
        public DateTime? PublishedDate { get; set; }
        public bool Available { get; set; }
        public int Quantity { get; set; }
        public string? Description { get; set; }

        // Add photo data as Base64 string
        public string? CoverImage { get; set; }
        public string? CoverImageContentType { get; set; }
    }
}