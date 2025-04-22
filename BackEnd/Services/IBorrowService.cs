using BackEnd.DTOs;


namespace BackEnd.Services
{
    public interface IBorrowService
    {
        Task<BorrowRequestDTO> RequestBorrow(long userId, long bookId);
        Task<IEnumerable<BorrowRequestDTO>> GetBorrowRequests(string status);
        Task<BorrowRequestDTO> ApproveBorrowRequest(long requestId, long librarianId);
        Task<BorrowRequestDTO> RejectBorrowRequest(long requestId, long librarianId);
        Task<BorrowRecordDTO> ReturnBook(long recordId, long librarianId);
        Task<IEnumerable<BorrowRecordDTO>> GetBorrowRecords();
        Task<IEnumerable<BorrowRecordDTO>> GetUserBorrowRecords(long userId);
    }
}
