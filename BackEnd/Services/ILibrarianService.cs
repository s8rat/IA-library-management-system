using BackEnd.DTOs;

namespace BackEnd.Services
{
    public interface ILibrarianService
    {
        Task<IEnumerable<LibrarianRequestDTO>> GetLibrarianRequests(string status);
        Task<LibrarianRequestDTO> ApproveLibrarianRequest(long requestId, long adminId);
        Task<LibrarianRequestDTO> RejectLibrarianRequest(long requestId, long adminId);
        Task<IEnumerable<UserDTO>> GetAllLibrarians();
        Task<bool> DeleteLibrarian(long librarianId);
    }
}
