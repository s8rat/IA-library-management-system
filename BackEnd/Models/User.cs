using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Role { get; set; } // "Admin", "Librarian", "User"

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [EmailAddress]
        public string? Email { get; set; }

        public ICollection<BorrowRequest> BorrowRequests { get; set; }
        public ICollection<BorrowRecord> BorrowRecords { get; set; }
        public ICollection<LibrarianRequest> LibrarianRequests { get; set; }
    }

}
