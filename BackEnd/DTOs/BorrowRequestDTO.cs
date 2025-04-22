namespace BackEnd.DTOs
{
    public class BorrowRequestDTO
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Username { get; set; }
        public long BookId { get; set; }
        public string BookTitle { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; }
    }
}
