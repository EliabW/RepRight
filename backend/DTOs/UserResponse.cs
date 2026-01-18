namespace backend.DTOs;

public class UserResponse
{
    public int UserID { get; set; }
    public required string UserGivenName { get; set; }
    public required string UserFamilyName { get; set; }
    public required string UserEmail { get; set; }
    public DateTime CreatedDateTime { get; set; }
    public DateTime UpdatedDateTime { get; set; }
    public DateTime? LastLoginDateTime { get; set; }
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public bool DarkMode { get; set; }
}
