using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ChangePasswordRequest
{
    [Required(ErrorMessage = "Current password is required")]
    [MaxLength(100)]
    public required string CurrentPassword { get; set; }

    [Required(ErrorMessage = "New password is required")]
    [MaxLength(100)]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$",
        ErrorMessage = "New password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
    )]
    public required string NewPassword { get; set; }
}
