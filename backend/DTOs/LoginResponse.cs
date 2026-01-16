namespace backend.DTOs;

public class LoginResponse
{
    public int UserID { get; set; }
    public required string UserGivenName { get; set; }
    public required string UserFamilyName { get; set; }
    public required string UserEmail { get; set; }
    public required string Token { get; set; }
}
