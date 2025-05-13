using BackEnd.Data;
using BackEnd.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using System.Linq;

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
                    GroupName = "Global"
                };
                _context.ChatMessages.Add(chatMessage);
                await _context.SaveChangesAsync();

                // Broadcast the message to all clients with the correct timestamp
                await Clients.All.SendAsync("ReceiveMessage", user.Username, message, chatMessage.Timestamp.ToString("o"));
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error sending message: {ex.Message}");
                Console.Error.WriteLine($"Stack trace: {ex.StackTrace}");
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }

        public async Task GetChatHistory()
        {
            try
            {
                var messages = await _context.ChatMessages
                    .Include(m => m.User)
                    .OrderByDescending(m => m.Timestamp)
                    .Take(1000)
                    .Select(m => new
                    {
                        user = m.User.Username,
                        message = m.Message,
                        timestamp = m.Timestamp.ToString("o")
                    })
                    .ToListAsync();

                if (!messages.Any())
                {
                    Console.WriteLine("No chat messages found in database");
                }
                else
                {
                    Console.WriteLine($"Retrieved {messages.Count} chat messages");
                    foreach (var msg in messages)
                    {
                        Console.WriteLine($"Message: {msg.user} - {msg.message} - {msg.timestamp}");
                    }
                }

                await Clients.Caller.SendAsync("ReceiveChatHistory", messages);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error getting chat history: {ex.Message}");
                Console.Error.WriteLine($"Stack trace: {ex.StackTrace}");
                await Clients.Caller.SendAsync("Error", "Failed to retrieve chat history");
            }
        }

        // Send a message to a specific group
        //public async Task SendMessageToGroup(string groupName, string user, string message)
        //{
        //    // Save the message to the database
        //    var chatMessage = new ChatMessage
        //    {
        //        User = user,
        //        Message = message,
        //        Timestamp = DateTime.UtcNow,
        //        GroupName = groupName
        //    };
        //    _context.ChatMessages.Add(chatMessage);
        //    await _context.SaveChangesAsync();

        //    // Broadcast the message to the group
        //    await Clients.Group(groupName).SendAsync("ReceiveMessage", user, message);
        //}

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
