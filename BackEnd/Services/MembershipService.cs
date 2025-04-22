using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Services
{
    public class MembershipService : IMembershipService
    {
        private readonly ApplicationDbContext _dbContext; // Renamed to avoid ambiguity  

        public MembershipService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Membership>> GetAllMembershipsAsync() =>
            await _dbContext.Memberships.Include(m => m.UserMemberships).ToListAsync();

        public async Task<Membership?> GetMembershipByIdAsync(int id) =>
            await _dbContext.Memberships.Include(m => m.UserMemberships)
                                         .FirstOrDefaultAsync(m => m.MembershipId == id);

        public async Task<Membership> AddMembershipAsync(MembershipDTO dto)
        {
            var membership = new Membership
            {
                MembershipType = dto.MembershipType,
                BorrowLimit = dto.BorrowLimit,
                DurationInDays = dto.DurationInDays,
                Price = dto.Price,
                Description = dto.Description,
                IsFamilyPlan = dto.IsFamilyPlan,
                MaxFamilyMembers = dto.MaxFamilyMembers
            };
            _dbContext.Memberships.Add(membership);
            await _dbContext.SaveChangesAsync();
            return membership;
        }

        public async Task<Membership?> EditMembershipAsync(int id, MembershipDTO dto)
        {
            var membership = await _dbContext.Memberships.FindAsync(id);
            if (membership == null) return null;

            membership.MembershipType = dto.MembershipType;
            membership.BorrowLimit = dto.BorrowLimit;
            membership.DurationInDays = dto.DurationInDays;
            membership.Price = dto.Price;
            membership.Description = dto.Description;
            membership.IsFamilyPlan = dto.IsFamilyPlan;
            membership.MaxFamilyMembers = dto.MaxFamilyMembers;

            await _dbContext.SaveChangesAsync();
            return membership;
        }

        public async Task<bool> DeleteMembershipAsync(int id)
        {
            var membership = await _dbContext.Memberships.FindAsync(id);
            if (membership == null) return false;

            _dbContext.Memberships.Remove(membership);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<UserMembership> RequestMembershipAsync(long userId, int membershipId, long? parentUserId = null)
        {
            var membership = await _dbContext.Memberships.FindAsync(membershipId);
            if (membership == null) throw new Exception("Membership not found");

            var request = new UserMembership
            {
                UserId = userId,
                MembershipId = membershipId,
                ParentUserId = parentUserId,
                Status = "Pending",
                IsActive = false
            };

            _dbContext.UserMemberships.Add(request);
            await _dbContext.SaveChangesAsync();
            return request;
        }

        public async Task<UserMembership?> ApproveMembershipAsync(int userMembershipId, long approverId)
        {
            var request = await _dbContext.UserMemberships.Include(um => um.Membership).FirstOrDefaultAsync(um => um.UserMembershipId == userMembershipId);
            if (request == null) return null;

            request.Status = "Approved";
            request.IsActive = true;
            request.StartDate = DateTime.UtcNow;
            request.EndDate = DateTime.UtcNow.AddDays(request.Membership.DurationInDays);

            await _dbContext.SaveChangesAsync();
            return request;
        }

        public async Task<UserMembership?> RejectMembershipAsync(int userMembershipId, long approverId)
        {
            var request = await _dbContext.UserMemberships.FindAsync(userMembershipId);
            if (request == null) return null;

            request.Status = "Rejected";
            request.IsActive = false;

            await _dbContext.SaveChangesAsync();
            return request;
        }

        public async Task<bool> CancelMembershipAsync(int userMembershipId, long userId)
        {
            var request = await _dbContext.UserMemberships.FindAsync(userMembershipId);
            if (request == null || request.UserId != userId) return false;

            request.IsCanceled = true;
            request.IsActive = false;
            request.EndDate = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
