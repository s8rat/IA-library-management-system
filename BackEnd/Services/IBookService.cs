using BackEnd.DTOs;

namespace BackEnd.Services
{
    public interface IBookService
    {
        Task<IEnumerable<BookDTO>> GetAllBooks();
        Task<BookDTO> GetBookById(long id);
        Task<BookDTO> AddBook(CreateBookDTO bookDTO);
        Task<BookDTO> UpdateBook(long id, CreateBookDTO bookDTO);
        Task<bool> DeleteBook(long id);
        Task<IEnumerable<BookDTO>> SearchBooks(string searchTerm);
    }
}
