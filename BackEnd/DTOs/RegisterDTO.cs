using System.ComponentModel.DataAnnotations;

public class RegisterDTO
{
    [Required]
    [StringLength(50)]
    public string Username { get; set; }

    [Required]
    [StringLength(255)]
    public string Password { get; set; }

    [Required]
    [StringLength(50)]
    public string FirstName { get; set; }

    [Required]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required]
    [StringLength(14)] // Format: XXX-XX-XXXX
    public string SSN { get; set; }

    [Phone]
    [StringLength(15)] // Allows for international formats
    public string? PhoneNumber { get; set; } // New field

    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }

    public string Role { get; set; } = "User";
}
