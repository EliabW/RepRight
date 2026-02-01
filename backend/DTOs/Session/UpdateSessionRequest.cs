using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class UpdateSessionRequest
{
    [MaxLength(100)]
    public required string SessionType { get; set; }

    public DateTime? StartTime { get; set; }

    public int? SessionReps { get; set; }

    public double? SessionScore { get; set; }

    public string? SessionFeedback { get; set; }

    public int? SessionDurationSec { get; set; }

    public List<double>? RepScores { get; set; }
}
