// database entity representation for a User
export interface User {
  UserID?: number;
  UserGivenName: string;
  UserFamilyName: string;
  UserEmail: string;
  UserPassword: string;
  CreatedDateTime?: Date;
  UpdatedDateTime?: Date;
  LastLoginDateTime?: Date | null;
}

// data transfer object for User responses (excluding sensitive information)
// like DTOs for C#
export interface UserResponse {
  UserID: number;
  UserGivenName: string;
  UserFamilyName: string;
  UserEmail: string;
  CreatedDateTime: Date;
}
export interface RegisterRequest {
  UserGivenName: string;
  UserFamilyName: string;
  UserEmail: string;
  UserPassword: string;
}
// response structure for login and registration operations
export interface LoginResponse {
  UserId: number;
  UserGivenName: string;
  UserFamilyName: string;
  UserEmail: string;
  Token: string;
}
// request structure for login operation
export interface LoginRequest {
  UserEmail: string;
  UserPassword: string;
}
