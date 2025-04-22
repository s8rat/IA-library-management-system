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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configurations
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Username).IsUnique();
                entity.HasIndex(u => u.Email).IsUnique();

                // Relationships
                entity.HasMany(u => u.BorrowRequests)
                    .WithOne(br => br.User)
                    .HasForeignKey(br => br.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.BorrowRecords)
                    .WithOne(br => br.User)
                    .HasForeignKey(br => br.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.LibrarianRequests)
                    .WithOne(lr => lr.User)
                    .HasForeignKey(lr => lr.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.UserMemberships)
                    .WithOne(um => um.User)
                    .HasForeignKey(um => um.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(u => u.FamilyMembers)
                    .WithOne(um => um.ParentUser)
                    .HasForeignKey(um => um.ParentUserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Book configurations
            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasIndex(b => b.ISBN).IsUnique();

                entity.HasMany(b => b.BorrowRecords)
                    .WithOne(br => br.Book)
                    .HasForeignKey(br => br.BookId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // BorrowRequest configurations
            modelBuilder.Entity<BorrowRequest>(entity =>
            {
                entity.HasOne(br => br.Book)
                    .WithOne(b => b.BorrowRequest)
                    .HasForeignKey<BorrowRequest>(br => br.BookId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(br => br.BorrowRecord)
                    .WithOne(br => br.BorrowRequest)
                    .HasForeignKey<BorrowRecord>(br => br.BorrowRequestId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // BorrowRecord configurations
            modelBuilder.Entity<BorrowRecord>(entity =>
            {
                entity.HasIndex(br => br.BorrowRequestId).IsUnique();
            });

            // Membership configurations
            modelBuilder.Entity<Membership>(entity =>
            {
                entity.Property(m => m.Price).HasPrecision(18, 2);

                entity.HasMany(m => m.UserMemberships)
                    .WithOne(um => um.Membership)
                    .HasForeignKey(um => um.MembershipId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // UserMembership configurations
            modelBuilder.Entity<UserMembership>(entity =>
            {
                entity.HasKey(um => um.UserMembershipId);

                entity.Property(um => um.Status)
                    .HasDefaultValue("Pending");
            });
        }
    }
}