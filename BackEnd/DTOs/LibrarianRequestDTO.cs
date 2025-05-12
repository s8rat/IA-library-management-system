namespace BackEnd.DTOs
{
    public class LibrarianRequestDTO
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public string Username { get; set; }
        public DateTime RequestDate { get; set; }
        public string requestMsg { get; set; }
        public string Status { get; set; }
    }
}