using BackEnd.DTOs;


namespace BackEnd.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllUsers();
        Task<UserDTO> GetUserById(long id);
        Task<UserDTO> CreateUser(UserDTO userDTO);
        Task<UserDTO> UpdateUser(long id, UserDTO userDTO);
        Task<bool> DeleteUser(long id);
    }
}