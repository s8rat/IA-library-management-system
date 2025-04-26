
namespace BackEnd.DTOs
{
    public class AuthResponseDTO
    {
        //add id for navigation
        public string Token { get; set; }
        public string Username { get; set; }
        public string Role { get; set; }
    }
}
