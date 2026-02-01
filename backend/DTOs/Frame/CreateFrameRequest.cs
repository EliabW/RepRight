namespace backend.DTOs;

public class CreateFrameRequest
{
    public int FrameNumber { get; set; }
    public KeypointData? Nose { get; set; }
    public KeypointData? LeftEye { get; set; }
    public KeypointData? RightEye { get; set; }
    public KeypointData? LeftEar { get; set; }
    public KeypointData? RightEar { get; set; }
    public KeypointData? LeftShoulder { get; set; }
    public KeypointData? RightShoulder { get; set; }
    public KeypointData? LeftElbow { get; set; }
    public KeypointData? RightElbow { get; set; }
    public KeypointData? LeftWrist { get; set; }
    public KeypointData? RightWrist { get; set; }
    public KeypointData? LeftHip { get; set; }
    public KeypointData? RightHip { get; set; }
    public KeypointData? LeftKnee { get; set; }
    public KeypointData? RightKnee { get; set; }
    public KeypointData? LeftAnkle { get; set; }
    public KeypointData? RightAnkle { get; set; }
}
