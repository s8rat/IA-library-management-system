﻿using BackEnd.DTOs;


namespace BackEnd.Services
{
    public interface IUserService
    {
        Task<IEnumerable<UserDTO>> GetAllUsers();
        Task<UserDTO> GetUserById(long id);
        Task<UserDTO> CreateUser(UserDTO userDTO);
        Task<UserDTO> GetCurrentUserProfile(long userId);
        Task<UserDTO> UpdateUser(long id, UpdateUserDTO updateUserDTO);
        Task<bool> DeleteUser(long id);
    }
}