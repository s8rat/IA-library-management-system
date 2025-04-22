using System.ComponentModel.DataAnnotations;

namespace BackEnd.DTOs
{
    public class MembershipRequestDTO
    {
        [Required]
        public long UserId { get; set; }

        [Required]
        public int MembershipId { get; set; }

        public long? ParentUserId { get; set; } // Only needed for family memberships
    }
}