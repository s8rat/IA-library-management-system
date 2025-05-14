using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class BorrowRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public virtual User? User { get; set; }

        [ForeignKey("Book")]
        public long? BookId { get; set; }
        public virtual Book? Book { get; set; }

        // Book information fields to preserve book details
        public string? BookTitle { get; set; }
        public string? BookAuthor { get; set; }
        public string? BookISBN { get; set; }

        public DateTime BorrowDate { get; set; } = DateTime.UtcNow;

        public DateTime DueDate { get; set; }

        public DateTime? ReturnDate { get; set; }

        [Required]
        public string Status { get; set; } // "Borrowed", "Returned"

        // Removed BorrowRequestId and navigation property
    }
}
