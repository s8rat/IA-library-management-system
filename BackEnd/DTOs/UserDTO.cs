namespace BackEnd.DTOs
{
    public class UserDTO
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Email { get; set; }
    }
}
