using BackEnd.Data;
using BackEnd.DTOs;
using BackEnd.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BackEnd.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponseDTO> Login(LoginDTO loginDTO)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDTO.Username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDTO.Password, user.Password))
            {
                throw new Exception("Invalid username or password");
            }

            var token = GenerateJwtToken(user);
            return new AuthResponseDTO
            {
                Token = token,
                Username = user.Username,
                Role = user.Role,
                Id = user.Id
            };
        }

        public async Task<AuthResponseDTO> Register(RegisterDTO registerDTO)
        {
            if (await _context.Users.AnyAsync(u => u.Username == registerDTO.Username))
            {
                throw new Exception("Username already exists");
            }

            if (await _context.Users.AnyAsync(u => u.Email == registerDTO.Email))
            {
                throw new Exception("Email already exists");
            }

            var user = new User
            {
                Username = registerDTO.Username,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDTO.Password),
                Role = "User",
                Email = registerDTO.Email,
                CreatedAt = DateTime.UtcNow,
                FirstName = registerDTO.FirstName,
                LastName = registerDTO.LastName,
                SSN = registerDTO.SSN,
                PhoneNumber = registerDTO.PhoneNumber
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var token = GenerateJwtToken(user);
            return new AuthResponseDTO
            {
                Token = token,
                Username = user.Username,
                Role = user.Role,
                Id = user.Id
            };
        }

        public async Task<bool> RequestLibrarianRole(long userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (user.Role != "User")
            {
                throw new Exception("Only regular users can request librarian role");
            }

            var existingRequest = await _context.LibrarianRequests
                .FirstOrDefaultAsync(lr => lr.UserId == userId && lr.Status == "Pending");

            if (existingRequest != null)
            {
                throw new Exception("You already have a pending request");
            }

            var request = new LibrarianRequest
            {
                UserId = userId,
                RequestDate = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.LibrarianRequests.Add(request);
            await _context.SaveChangesAsync();
            return true;
        }

        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("userId", user.Id.ToString(), ClaimValueTypes.Integer64)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(3),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

