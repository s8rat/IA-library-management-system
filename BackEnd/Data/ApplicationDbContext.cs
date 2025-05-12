using BackEnd.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<BorrowRequest> BorrowRequests { get; set; }
        public DbSet<BorrowRecord> BorrowRecords { get; set; }
        public DbSet<LibrarianRequest> LibrarianRequests { get; set; }
        public DbSet<Membership> Memberships { get; set; }
        public DbSet<UserMembership> UserMemberships { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.SSN)
                .IsUnique();

            // Configure Book
            modelBuilder.Entity<Book>()
                .HasIndex(b => b.ISBN)
                .IsUnique();

            // Configure BorrowRequest
            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.User)
                .WithMany(u => u.BorrowRequests)
                .HasForeignKey(br => br.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.Book)
                .WithMany(b => b.BorrowRequests)
                .HasForeignKey(br => br.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure BorrowRecord
            modelBuilder.Entity<BorrowRecord>()
                .HasOne(br => br.User)
                .WithMany(u => u.BorrowRecords)
                .HasForeignKey(br => br.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BorrowRecord>()
                .HasOne(br => br.Book)
                .WithMany(b => b.BorrowRecords)
                .HasForeignKey(br => br.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<BorrowRecord>()
                .HasOne(br => br.BorrowRequest)
                .WithOne(br => br.BorrowRecord)
                .HasForeignKey<BorrowRecord>(br => br.BorrowRequestId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure UserMembership
            modelBuilder.Entity<UserMembership>()
                .HasOne(um => um.User)
                .WithMany(u => u.UserMemberships)
                .HasForeignKey(um => um.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserMembership>()
                .HasOne(um => um.Membership)
                .WithMany(m => m.UserMemberships)
                .HasForeignKey(um => um.MembershipId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserMembership>()
                .HasOne(um => um.ParentUser)
                .WithMany(u => u.FamilyMembers)
                .HasForeignKey(um => um.ParentUserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure LibrarianRequest
            modelBuilder.Entity<LibrarianRequest>()
                .HasOne(lr => lr.User)
                .WithMany(u => u.LibrarianRequests)
                .HasForeignKey(lr => lr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure ChatMessage
            modelBuilder.Entity<ChatMessage>()
                .HasOne(cm => cm.User)
                .WithMany()
                .HasForeignKey(cm => cm.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Books
            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    Id = 1,
                    Title = "C# Programming",
                    Author = "John Doe",
                    ISBN = "978-3-16-148410-0",
                    PublishedDate = new DateTime(2020, 1, 1),
                    Available = true,
                    Quantity = 5
                },
                new Book
                {
                    Id = 2,
                    Title = "ASP.NET Core Guide",
                    Author = "Jane Smith",
                    ISBN = "978-1-23-456789-0",
                    PublishedDate = new DateTime(2021, 5, 15),
                    Available = true,
                    Quantity = 3
                }
            );

            // Seed Memberships
            modelBuilder.Entity<Membership>().HasData(
                new Membership
                {
                    MembershipId = 1,
                    MembershipType = "Standard",
                    BorrowLimit = 5,
                    DurationInDays = 30,
                    Price = 9.99m,
                    Description = "Standard membership with a borrow limit of 5 books.",
                    IsFamilyPlan = false,
                    MaxFamilyMembers = null,
                    RequiresApproval = true,
                    CreatedAt = new DateTime(2025, 4, 1) // Static value
                },
                new Membership
                {
                    MembershipId = 2,
                    MembershipType = "Family",
                    BorrowLimit = 10,
                    DurationInDays = 30,
                    Price = 19.99m,
                    Description = "Family membership with a borrow limit of 10 books.",
                    IsFamilyPlan = true,
                    MaxFamilyMembers = 4,
                    RequiresApproval = true,
                    CreatedAt = new DateTime(2025, 4, 1) // Static value
                }
            );
        }

    }
}