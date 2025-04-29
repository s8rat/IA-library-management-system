using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class seedingSomeDataAndFixngChatsv2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 1,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 24, 4, 42, 56, 320, DateTimeKind.Utc).AddTicks(4473));

            migrationBuilder.UpdateData(
                table: "Memberships",
                keyColumn: "MembershipId",
                keyValue: 2,
                column: "CreatedAt",
                value: new DateTime(2025, 4, 24, 4, 42, 56, 320, DateTimeKind.Utc).AddTicks(4647));
        }
    }
}
