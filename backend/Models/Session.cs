using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

// maps to the sessions table in the database
[Table("Sessions")]
public class Sessions
{
    [Key]
    public int SessionID { get; set; }

    [Required]
    public int UserID { get; set; }

    [Required]
    [MaxLength(255)]
    public required string SessionType { get; set; }

    public DateTime StartTime { get; set; }

    [Required]
    public int SessionReps { get; set; } = 0;

    public double? SessionScore { get; set; }

    [Column(TypeName = "text")]
    public string? SessionFeedback { get; set; }

    public int SessionDurationSec { get; set; } = 0;

    [ForeignKey("UserID")]
    public User? User { get; set; }
}
