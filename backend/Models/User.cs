using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

// maps to the users table in the database
[Table("Users")]
public class User
{
    [Key]
    public int UserID { get; set; }

    [Required]
    [MaxLength(100)]
    public required string UserGivenName { get; set; }

    [Required]
    [MaxLength(100)]
    public required string UserFamilyName { get; set; }

    [Required]
    [MaxLength(100)]
    public required string UserEmail { get; set; }

    [Required]
    [MaxLength(100)]
    public required string UserPassword { get; set; }

    public DateTime CreatedDateTime { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedDateTime { get; set; } = DateTime.UtcNow;

    public DateTime? LastLoginDateTime { get; set; }
}
