using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.DTOs
{
    public class CreateBookDTO
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Author { get; set; }

        public string? ISBN { get; set; }
        public DateTime? PublishedDate { get; set; }
        public int Quantity { get; set; } = 1;

        //[FileExtensions(Extensions = "jpg,jpeg,png,gif")]
        [FromForm]
        public IFormFile? CoverImageFile { get; set; }
    }
}