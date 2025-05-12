namespace BackEnd.DTOs
{
    public class BorrowRecordDTO
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Username { get; set; }
        public long? BookId { get; set; }
        public string? BookTitle { get; set; }
        public string? BookAuthor { get; set; }
        public string? BookISBN { get; set; }
        public DateTime BorrowDate { get; set; }
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Status { get; set; }
    }
}
