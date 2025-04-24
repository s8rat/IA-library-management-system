using BackEnd.Data;
using BackEnd.Models;
using BackEnd.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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

        // Add Controllers
        builder.Services.AddControllers();
        builder.Services.AddOpenApi();


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
                                     // Authorization Policies
                                     .AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"))
                                     // Authorization Policies
                                     .AddPolicy("LibrarianOnly", policy => policy.RequireRole("Librarian"))
                                     // Authorization Policies
                                     .AddPolicy("UserOnly", policy => policy.RequireRole("User"));



        var app = builder.Build();


        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
            app.MapScalarApiReference();
        }

        app.UseHttpsRedirection();

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
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                var logger = services.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occurred during migration and seeding.");
            }
        }

        await app.RunAsync();
    }
}