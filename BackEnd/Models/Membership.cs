using BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Membership
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int MembershipId { get; set; }

    [Required]
    [StringLength(100)]
    public string MembershipType { get; set; }

    [Required]
    public int BorrowLimit { get; set; }

    [Required]
    public int DurationInDays { get; set; }

    [Precision(18, 2)]
    public decimal? Price { get; set; }

    [StringLength(500)]
    public string? Description { get; set; }

    public bool IsFamilyPlan { get; set; } = false;

    public int? MaxFamilyMembers { get; set; }

    public bool RequiresApproval { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<UserMembership> UserMemberships { get; set; } = new List<UserMembership>();
}