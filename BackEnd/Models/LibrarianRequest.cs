using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    
    public class LibrarianRequest
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [ForeignKey("User")]
        public long UserId { get; set; }
        public User User { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        [Required]
        public string Status { get; set; } // "Pending", "Approved", "Rejected"
    }

}
