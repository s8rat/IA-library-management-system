using BackEnd.Data;
using BackEnd.Hubs;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.Text;

internal class Program
{
    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add DbContext
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

        // Register Services
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IBookService, BookService>();
        builder.Services.AddScoped<IBorrowService, BorrowService>();
        builder.Services.AddScoped<ILibrarianService, LibrarianService>();
        builder.Services.AddScoped<IUserService, UserService>();
        builder.Services.AddScoped<IMembershipService, MembershipService>();



        builder.Services.Configure<FormOptions>(options =>
        {
            options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10MB
        });


        // Add Controllers
        builder.Services.AddControllers();
        builder.Services.AddOpenApi();
        builder.Services.AddSignalR();

        // CORS for chat
        builder.Services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
            {
                //-------------------------------------- frontend url ---------------------------------------------//
                policy
                      .WithOrigins("http://localhost:5173")
                      //.AllowAnyOrigin()
                      .AllowAnyHeader()
                      .AllowAnyMethod();
                      //.AllowCredentials(); // Needed for SignalR
            });
        });

        // JWT Authentication
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                };
            });

        // Authorization Policies
        builder.Services.AddAuthorizationBuilder()
            .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"))
            .AddPolicy("LibrarianOnly", policy => policy.RequireRole("Librarian"))
            .AddPolicy("UserOnly", policy => policy.RequireRole("User"));

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        // app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            try
            {
                var context = services.GetRequiredService<ApplicationDbContext>();
                await context.Database.MigrateAsync();

                // Seed admin user
                if (!await context.Users.AnyAsync(u => u.Username == "admin"))
                {
                    context.Users.Add(new User
                    {
                        Username = "admin",
                        Password = BCrypt.Net.BCrypt.HashPassword("admin123"),
                        Role = "Admin",
                        Email = "admin@library.com",
                        CreatedAt = DateTime.UtcNow,
                        FirstName = "Admin",
                        LastName = "User",
                        SSN = "123-45-6789",
                        PhoneNumber = "123-456-7890"
                    });
                }

                // Seed additional users
                var users = new List<User>
                {
                    new User
                    {
                        Username = "salma",
                        Password = BCrypt.Net.BCrypt.HashPassword("password1"),
                        Role = "Librarian",
                        CreatedAt = DateTime.UtcNow,
                        Email = "salma@example.com",
                        FirstName = "Salma",
                        LastName = "Mostafa",
                        PhoneNumber = "1234567890",
                        SSN = "323-45-6789"
                    },
                    new User
                    {
                        Username = "sagheer",
                        Password = BCrypt.Net.BCrypt.HashPassword("password2"),
                        Role = "User",
                        CreatedAt = DateTime.UtcNow,
                        Email = "sagheer@example.com",
                        FirstName = "Mohammad",
                        LastName = "El-Sagheer",
                        PhoneNumber = "0987654321",
                        SSN = "213-65-4321"
                    },
                    new User
                    {
                        Username = "reda",
                        Password = BCrypt.Net.BCrypt.HashPassword("password3"),
                        Role = "User",
                        CreatedAt = DateTime.UtcNow,
                        Email = "reda@example.com",
                        FirstName = "Mhmd",
                        LastName = "Reda",
                        PhoneNumber = "0987654321",
                        SSN = "432-65-4321"
                    },
                    new User
                    {
                        Username = "ahmed",
                        Password = BCrypt.Net.BCrypt.HashPassword("password4"),
                        Role = "User",
                        CreatedAt = DateTime.UtcNow,
                        Email = "ahmed@example.com",
                        FirstName = "Ahmed",
                        LastName = "Hazem",
                        PhoneNumber = "0987654321",
                        SSN = "987-65-4321"
                    },
                    new User
                    {
                        Username = "nehal",
                        Password = BCrypt.Net.BCrypt.HashPassword("password5"),
                        Role = "User",
                        CreatedAt = DateTime.UtcNow,
                        Email = "nehal@example.com",
                        FirstName = "Nehal",
                        LastName = "Nady",
                        PhoneNumber = "0987654321",
                        SSN = "737-65-4321"
                    },
                    new User
                    {
                        Username = "tarek",
                        Password = BCrypt.Net.BCrypt.HashPassword("password6"),
                        Role = "User",
                        CreatedAt = DateTime.UtcNow,
                        Email = "tarek@example.com",
                        FirstName = "Mohammed",
                        LastName = "Tarek",
                        PhoneNumber = "0987654321",
                        SSN = "987-65-4321"
                    }
                };

                foreach (var user in users)
                {
                    if (!await context.Users.AnyAsync(u => u.Username == user.Username))
                    {
                        context.Users.Add(user);
                    }
                }

                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred during migration and seeding.");
            }
        }

        // Enable CORS
        app.UseCors();

        // Map SignalR hub
        app.MapHub<ChatHub>("/chathub");

        await app.RunAsync();
    }
}
