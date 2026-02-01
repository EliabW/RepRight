using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class UpdateUserRequest
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
}
