using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [MaxLength(100)]
    public required string UserEmail { get; set; }
}
