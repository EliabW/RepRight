namespace backend.DTOs;

public class CreateRepRequest
{
    public int RepNumber { get; set; }
    public float? RepScore { get; set; }
    public List<CreateFrameRequest>? Frames { get; set; }
}
