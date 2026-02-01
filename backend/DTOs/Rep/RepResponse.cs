namespace backend.DTOs;

public class RepResponse
{
    public int RepID { get; set; }
    public int RepNumber { get; set; }
    public float? RepScore { get; set; }
    public List<FrameResponse>? Frames { get; set; }
}
