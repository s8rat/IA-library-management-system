// Controllers/UsersController.cs
using BackEnd.DTOs;
using BackEnd.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        //[HttpGet("profile")]
        //[Authorize]
        // public async Task<IActionResult> GetCurrentUserProfile()
        // {
        //     try
        //     {
        //         // Log all claims for debugging
        //         var claims = User.Claims.ToList();
        //         Console.WriteLine("User Claims:");
        //         foreach (var claim in claims)
        //         {
        //             Console.WriteLine($"{claim.Type}: {claim.Value} (ValueType: {claim.ValueType})");
        //         }

        //         var userIdClaim = User.FindFirst("userId");
        //         if (userIdClaim == null)
        //         {
        //             Console.WriteLine("userId claim not found");
        //             return Unauthorized(new { message = "User ID not found in token" });
        //         }

        //         Console.WriteLine($"Found user ID claim: {userIdClaim.Value} (ValueType: {userIdClaim.ValueType})");

        //         if (!long.TryParse(userIdClaim.Value, out long userId))
        //         {
        //             Console.WriteLine($"Failed to parse user ID: {userIdClaim.Value}");
        //             Console.WriteLine($"ValueType: {userIdClaim.ValueType}");
        //             return BadRequest(new { 
        //                 message = "Invalid user ID format in token", 
        //                 details = $"Value: {userIdClaim.Value}, Type: {userIdClaim.ValueType}" 
        //             });
        //         }

        //         Console.WriteLine($"Successfully parsed user ID: {userId}");

        //         var user = await _userService.GetUserById(userId);
        //         if (user == null)
        //         {
        //             Console.WriteLine($"User with ID {userId} not found in database");
        //             return NotFound(new { message = "User not found" });
        //         }

        //         Console.WriteLine($"Successfully retrieved user: {user.Username}");
        //         return Ok(user);
        //     }
        //     catch (Exception ex)
        //     {
        //         Console.WriteLine($"Error in GetCurrentUserProfile: {ex.Message}");
        //         Console.WriteLine($"Stack trace: {ex.StackTrace}");
        //         return StatusCode(500, new { message = "An error occurred while retrieving the user profile", details = ex.Message });
        //     }
        // }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById(long id)
        {
            try
            {
                var user = await _userService.GetUserById(id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateUser([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = await _userService.CreateUser(userDTO);
                return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateUser(long id, [FromBody] UserDTO userDTO)
        {
            try
            {
                // Check if the user is updating their own profile or is an admin
                // var userId = long.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                // var isAdmin = User.IsInRole("Admin");
                
                // if (!isAdmin && userId != id)
                // {
                //     return Forbid();
                // }

                var user = await _userService.UpdateUser(id, userDTO);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser(long id)
        {
            try
            {
                var result = await _userService.DeleteUser(id);
                if (result)
                {
                    return NoContent();
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}