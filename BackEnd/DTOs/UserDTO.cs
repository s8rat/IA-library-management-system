namespace BackEnd.DTOs
{
    public class UserDTO
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string SSN { get; set; }
        public string? PhoneNumber { get; set; }
    }

    
}
