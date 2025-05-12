using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
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

        [Column(TypeName = "nvarchar(max)")]
        public string? Description { get; set; }

        // Photo properties
        public byte[]? CoverImage { get; set; }
        public string? CoverImageContentType { get; set; }

        [NotMapped]
        public IFormFile? CoverImageFile { get; set; }

        public ICollection<BorrowRequest> BorrowRequests { get; set; } = new List<BorrowRequest>();
        public ICollection<BorrowRecord> BorrowRecords { get; set; } = new List<BorrowRecord>();
    }
}