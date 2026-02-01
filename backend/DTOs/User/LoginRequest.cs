using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class LoginRequest
{
    [Required(ErrorMessage = "Email is required")]
    [MaxLength(100)]
    public required string UserEmail { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MaxLength(100)]
    public required string UserPassword { get; set; }
}
