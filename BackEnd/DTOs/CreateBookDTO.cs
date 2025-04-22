namespace BackEnd.DTOs
{
    public class CreateBookDTO
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public DateTime? PublishedDate { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
