using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    // Models/Book.cs
    public class Book
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string? ISBN { get; set; }

        public DateTime? PublishedDate { get; set; }

        public bool Available { get; set; } = true;

        public int Quantity { get; set; } = 1;

        public ICollection<BorrowRequest> BorrowRequests { get; set; }
        public ICollection<BorrowRecord> BorrowRecords { get; set; }
    }

}
