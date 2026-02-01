using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("Reps")]
public class Rep
{
    [Key]
    public int RepID { get; set; }

    [Required]
    public int SessionID { get; set; }

    [Required]
    public int RepNumber { get; set; }

    public float? RepScore { get; set; }

    [ForeignKey("SessionID")]
    public Sessions? Session { get; set; }

    // Navigation property for frames
    public ICollection<Frame> Frames { get; set; } = new List<Frame>();
}
