using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackEnd.Migrations
{
    /// <inheritdoc />
    public partial class UpdateBorrowRequestBorrowRecordRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BorrowRecords_BorrowRequests_BorrowRequestId",
                table: "BorrowRecords");

            migrationBuilder.AddForeignKey(
                name: "FK_BorrowRecords_BorrowRequests_BorrowRequestId",
                table: "BorrowRecords",
                column: "BorrowRequestId",
                principalTable: "BorrowRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BorrowRecords_BorrowRequests_BorrowRequestId",
                table: "BorrowRecords");

            migrationBuilder.AddForeignKey(
                name: "FK_BorrowRecords_BorrowRequests_BorrowRequestId",
                table: "BorrowRecords",
                column: "BorrowRequestId",
                principalTable: "BorrowRequests",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
