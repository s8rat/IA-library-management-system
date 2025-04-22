namespace BackEnd.DTOs
{
    public class BookDTO
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public string ISBN { get; set; }
        public DateTime? PublishedDate { get; set; }
        public bool Available { get; set; }
        public int Quantity { get; set; }
    }
}
