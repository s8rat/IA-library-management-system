using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class seedingSomeDataAndFixngChats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "Id", "Author", "Available", "ISBN", "PublishedDate", "Quantity", "Title" },
                values: new object[,]
                {
                    { 1L, "John Doe", true, "978-3-16-148410-0", new DateTime(2020, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, "C# Programming" },
                    { 2L, "Jane Smith", true, "978-1-23-456789-0", new DateTime(2021, 5, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "ASP.NET Core Guide" }
                });

            migrationBuilder.InsertData(
                table: "Memberships",
                columns: new[] { "MembershipId", "BorrowLimit", "CreatedAt", "Description", "DurationInDays", "IsFamilyPlan", "MaxFamilyMembers", "MembershipType", "Price", "RequiresApproval" },
                values: new object[,]
                {
                    { 1, 5, new DateTime(2025, 4, 24, 4, 42, 56, 320, DateTimeKind.Utc).AddTicks(4473), "Standard membership with a borrow limit of 5 books.", 30, false, null, "Standard", 9.99m, false },
                    { 2, 10, new DateTime(2025, 4, 24, 4, 42, 56, 320, DateTimeKind.Utc).AddTicks(4647), "Family membership with a borrow limit of 10 books.", 30, true, 4, "Family", 19.99m, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "Id",
                keyValue: 2L);

            migrationBuilder.DeleteData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2);
        }
    }
}
