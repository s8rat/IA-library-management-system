using System.ComponentModel.DataAnnotations;

namespace BackEnd.DTOs
{
    public class UpdateUserDTO
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 50 characters")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "First name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters")]
        public string LastName { get; set; }

        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 characters")]
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "Role is required")]
        [RegularExpression("^(Admin|Librarian|User)$", ErrorMessage = "Invalid role specified")]
        public string Role { get; set; }
    }
}
