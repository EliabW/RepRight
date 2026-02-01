using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("Frames")]
public class Frame
{
    [Key]
    public int FrameID { get; set; }

    [Required]
    public int RepID { get; set; }

    [Required]
    public int FrameNumber { get; set; }

    [Column(TypeName = "json")]
    public string? Nose { get; set; }

    [Column(TypeName = "json")]
    public string? LeftEye { get; set; }

    [Column(TypeName = "json")]
    public string? RightEye { get; set; }

    [Column(TypeName = "json")]
    public string? LeftEar { get; set; }

    [Column(TypeName = "json")]
    public string? RightEar { get; set; }

    [Column(TypeName = "json")]
    public string? LeftShoulder { get; set; }

    [Column(TypeName = "json")]
    public string? RightShoulder { get; set; }

    [Column(TypeName = "json")]
    public string? LeftElbow { get; set; }

    [Column(TypeName = "json")]
    public string? RightElbow { get; set; }

    [Column(TypeName = "json")]
    public string? LeftWrist { get; set; }

    [Column(TypeName = "json")]
    public string? RightWrist { get; set; }

    [Column(TypeName = "json")]
    public string? LeftHip { get; set; }

    [Column(TypeName = "json")]
    public string? RightHip { get; set; }

    [Column(TypeName = "json")]
    public string? LeftKnee { get; set; }

    [Column(TypeName = "json")]
    public string? RightKnee { get; set; }

    [Column(TypeName = "json")]
    public string? LeftAnkle { get; set; }

    [Column(TypeName = "json")]
    public string? RightAnkle { get; set; }

    [ForeignKey("RepID")]
    public Rep? Rep { get; set; }
}
