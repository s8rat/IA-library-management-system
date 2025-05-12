using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class FixingBookDeletion8 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1L,
                columns: new[] { "Author", "PublishedDate", "Title" },
                values: new object[] { "F. Scott Fitzgerald", new DateTime(1925, 4, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), "The Great Gatsby" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2L,
                columns: new[] { "Author", "PublishedDate", "Title" },
                values: new object[] { "Harper Lee", new DateTime(1960, 7, 11, 0, 0, 0, 0, DateTimeKind.Unspecified), "To Kill a Mockingbird" });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "Available", "CoverImage", "CoverImageContentType", "ISBN", "PublishedDate", "Quantity", "Title" },
                values: new object[,]
                {
                    { 3L, "George Orwell", true, null, null, "978-0-45-152493-5", new DateTime(1949, 6, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "1984" },
                    { 4L, "Jane Austen", true, null, null, "978-0-14-143951-8", new DateTime(1813, 1, 28, 0, 0, 0, 0, DateTimeKind.Unspecified), 6, "Pride and Prejudice" },
                    { 5L, "J.D. Salinger", true, null, null, "978-0-31-676948-8", new DateTime(1951, 7, 16, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "The Catcher in the Rye" },
                    { 6L, "J.R.R. Tolkien", true, null, null, "978-0-54-792822-7", new DateTime(1937, 9, 21, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "The Hobbit" },
                    { 7L, "Paulo Coelho", true, null, null, "978-0-06-231500-7", new DateTime(1988, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, "The Alchemist" },
                    { 8L, "Antoine de Saint-Exupéry", true, null, null, "978-0-15-601398-7", new DateTime(1943, 4, 6, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "The Little Prince" },
                    { 9L, "Dan Brown", true, null, null, "978-0-30-747427-8", new DateTime(2003, 3, 18, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, "The Da Vinci Code" },
                    { 10L, "Khaled Hosseini", true, null, null, "978-1-59-463193-1", new DateTime(2003, 5, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "The Kite Runner" }
                });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                columns: new[] { "BorrowLimit", "Description", "DurationInDays", "IsFamilyPlan", "MaxFamilyMembers", "MembershipType", "Price", "RequiresApproval" },
                values: new object[] { 15, "Premium membership with extended duration and higher borrow limit.", 60, false, null, "Premium", 24.99m, false });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 3L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 4L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 5L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 6L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 7L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 8L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 9L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 10L);

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1L,
                columns: new[] { "Author", "PublishedDate", "Title" },
                values: new object[] { "John Doe", new DateTime(2020, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "C# Programming" });

            migrationBuilder.UpdateData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2L,
                columns: new[] { "Author", "PublishedDate", "Title" },
                values: new object[] { "Jane Smith", new DateTime(2021, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), "ASP.NET Core Guide" });

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                columns: new[] { "BorrowLimit", "Description", "DurationInDays", "IsFamilyPlan", "MaxFamilyMembers", "MembershipType", "Price", "RequiresApproval" },
                values: new object[] { 10, "Family membership with a borrow limit of 10 books.", 30, true, 4, "Family", 19.99m, true });
        }
    }
}
