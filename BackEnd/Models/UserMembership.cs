using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class UserMembership
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserMembershipId { get; set; }

        [Required]
        public long UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; }

        [Required]
        public int MembershipId { get; set; }

        [ForeignKey("MembershipId")]
        public virtual Membership Membership { get; set; }

        public DateTime StartDate { get; set; } = DateTime.UtcNow;
        public DateTime? EndDate { get; set; }
        public bool IsCanceled { get; set; } = false;
        public bool IsActive { get; set; } = true;

        // For family memberships
        public long? ParentUserId { get; set; }

        [ForeignKey("ParentUserId")]
        [InverseProperty("FamilyMembers")]
        public virtual User? ParentUser { get; set; }

        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // "Pending", "Approved", "Rejected", "Canceled"
    }
}