namespace BackEnd.DTOs
{
    public class MembershipDTO
    {
        public string MembershipType { get; set; }
        public int BorrowLimit { get; set; }
        public int DurationInDays { get; set; }
        public decimal? Price { get; set; }
        public string? Description { get; set; }
        public bool IsFamilyPlan { get; set; }
        public int? MaxFamilyMembers { get; set; }
        public bool RequiresApproval { get; set; } = true;
    }
}