using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class ChatMessage
    {
        [Key]
        public long Id { get; set; }

        [Required]
        public long UserId { get; set; } // Foreign key to User

        [ForeignKey("UserId")]
        public virtual User User { get; set; } // Navigation property

        [Required]
        public string Message { get; set; }

        public string? GroupName { get; set; } // Null for global messages

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
