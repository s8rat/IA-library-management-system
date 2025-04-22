using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Models
{
    public class BorrowRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }

        [ForeignKey("Book")]
        public long BookId { get; set; }
        public Book Book { get; set; }

        public DateTime BorrowDate { get; set; } = DateTime.UtcNow;

        public DateTime DueDate { get; set; }

        public DateTime? ReturnDate { get; set; }

        [Required]
        public string Status { get; set; } // "Borrowed", "Returned"

        [ForeignKey("BorrowRequest")]
        public long BorrowRequestId { get; set; }

        [DeleteBehavior(DeleteBehavior.NoAction)] // Add this attribute
        public BorrowRequest BorrowRequest { get; set; }
    }
}