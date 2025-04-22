// Data/ApplicationDbContext.cs
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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Unique constraints
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Book>()
                .HasIndex(b => b.ISBN)
                .IsUnique();

            // Configure the one-to-one relationship between BorrowRequest and BorrowRecord
            modelBuilder.Entity<BorrowRequest>()
                .HasOne(br => br.BorrowRecord)
                .WithOne(br => br.BorrowRequest)
                .HasForeignKey<BorrowRecord>(br => br.BorrowRequestId)
                .OnDelete(DeleteBehavior.Restrict); // Prevents cascade delete issues

            // Configure the one-to-many relationships
            modelBuilder.Entity<User>()
                .HasMany(u => u.BorrowRequests)
                .WithOne(br => br.User)
                .HasForeignKey(br => br.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.BorrowRecords)
                .WithOne(br => br.User)
                .HasForeignKey(br => br.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .HasMany(u => u.LibrarianRequests)
                .WithOne(lr => lr.User)
                .HasForeignKey(lr => lr.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Book>()
                .HasMany(b => b.BorrowRequests)
                .WithOne(br => br.Book)
                .HasForeignKey(br => br.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Book>()
                .HasMany(b => b.BorrowRecords)
                .WithOne(br => br.Book)
                .HasForeignKey(br => br.BookId)
                .OnDelete(DeleteBehavior.Restrict);

            // Ensure BorrowRequestId is unique in BorrowRecords (for one-to-one)
            modelBuilder.Entity<BorrowRecord>()
                .HasIndex(br => br.BorrowRequestId)
                .IsUnique();
        }
    }
}