using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateUserRequest
{
    [Required(ErrorMessage = "First name is required")]
    [MaxLength(100)]
    public required string UserGivenName { get; set; }

    [Required(ErrorMessage = "Last name is required")]
    [MaxLength(100)]
    public required string UserFamilyName { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [MaxLength(100)]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public required string UserEmail { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [MaxLength(100)]
    [RegularExpression(
        @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$",
        ErrorMessage = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number."
    )]
    public required string UserPassword { get; set; }
}
