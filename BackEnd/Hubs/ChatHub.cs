using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace BackEnd.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public ChatHub(ApplicationDbContext context)
        {
            _context = context;
        }

        // Send a message to everyone in the global chat
        public async Task SendMessageToAll(long userId, string message)
        {
            try
            {
                // Retrieve the user from the database
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    throw new Exception("User not found");
                }

                // Validate the message
                if (string.IsNullOrWhiteSpace(message))
                {
                    throw new Exception("Message cannot be empty");
                }

                // Save the message to the database
                var chatMessage = new ChatMessage
                {
                    UserId = userId,
                    User = user,
                    Message = message,
                    Timestamp = DateTime.UtcNow,
                    GroupName = "Global" // Indicate it's a global message
                };
                _context.ChatMessages.Add(chatMessage);
                await _context.SaveChangesAsync();

                // Broadcast the message to all clients
                await Clients.All.SendAsync("ReceiveMessage", user.Username, message);
            }
            catch (DbUpdateException dbEx)
            {
                // Handle database update errors
                await Clients.Caller.SendAsync("Error", "A database error occurred while saving the message.");
                Console.Error.WriteLine($"Database error: {dbEx.Message}");
            }
            catch (Exception ex)
            {
                // Handle general errors
                await Clients.Caller.SendAsync("Error", ex.Message);
                Console.Error.WriteLine($"Error: {ex.Message}");
            }
        }


        public async Task GetChatHistory()
        {
            var messages = await _context.ChatMessages
                .Include(m => m.User) // Ensure the User navigation property is loaded
                .OrderByDescending(m => m.Timestamp)
                .Take(1000)
                .Select(m => new
                {
                    User = m.User != null ? m.User.Username : "Unknown", // Handle null User
                    Message = !string.IsNullOrWhiteSpace(m.Message) ? m.Message : "No message", // Handle null or empty Message
                    Timestamp = m.Timestamp != default ? m.Timestamp.ToString("o") : null // Handle invalid Timestamp
                })
                .ToListAsync();

            // Send the messages to the client
            await Clients.Caller.SendAsync("ReceiveChatHistory", messages);
        }


        //    // Send a message to a specific group
        //    public async Task SendMessageToGroup(string groupName, string user, string message)
        //    {
        //        // Save the message to the database
        //        var chatMessage = new ChatMessage
        //        {
        //            User = user,
        //            Message = message,
        //            Timestamp = DateTime.UtcNow,
        //            GroupName = groupName
        //        };
        //        _context.ChatMessages.Add(chatMessage);
        //        await _context.SaveChangesAsync();

        //        // Broadcast the message to the group
        //        await Clients.Group(groupName).SendAsync("ReceiveMessage", user, message);
        //    }

        //    // Join a specific group
        //    public async Task JoinGroup(string groupName)
        //    {
        //        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        //        // Save the group join event to the database
        //        var groupEvent = new ChatMessage
        //        {
        //            User = Context.ConnectionId,
        //            Message = $"{Context.ConnectionId} has joined the group {groupName}.",
        //            Timestamp = DateTime.UtcNow,
        //            GroupName = groupName
        //        };
        //        _context.ChatMessages.Add(groupEvent);
        //        await _context.SaveChangesAsync();

        //        // Notify the group
        //        await Clients.Group(groupName).SendAsync("GroupNotification", groupEvent.Message);
        //    }

        //    // Leave a specific group
        //    public async Task LeaveGroup(string groupName)
        //    {
        //        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        //        // Save the group leave event to the database
        //        var groupEvent = new ChatMessage
        //        {
        //            User = Context.ConnectionId,
        //            Message = $"{Context.ConnectionId} has left the group {groupName}.",
        //            Timestamp = DateTime.UtcNow,
        //            GroupName = groupName
        //        };
        //        _context.ChatMessages.Add(groupEvent);
        //        await _context.SaveChangesAsync();

        //        // Notify the group
        //        await Clients.Group(groupName).SendAsync("GroupNotification", groupEvent.Message);
        //    }
    }
}
