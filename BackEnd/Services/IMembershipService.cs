using BackEnd.DTOs;
using BackEnd.Models;

namespace BackEnd.Services
{
    public interface IMembershipService
    {
        Task<List<Membership>> GetAllMembershipsAsync();
        Task<Membership?> GetMembershipByIdAsync(int id);
        Task<Membership> AddMembershipAsync(MembershipDTO dto);
        Task<Membership?> EditMembershipAsync(int id, MembershipDTO dto);
        Task<bool> DeleteMembershipAsync(int id);

        Task<UserMembership> RequestMembershipAsync(long userId, int membershipId, long? parentUserId = null);
        Task<UserMembership?> ApproveMembershipAsync(int userMembershipId, long approverId);
        Task<UserMembership?> RejectMembershipAsync(int userMembershipId, long approverId);
        Task<bool> CancelMembershipAsync(int userMembershipId, long userId);
        Task<List<UserMembership>> GetPendingRequestsAsync();
    }
}
