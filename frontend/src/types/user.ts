export interface User {
  userID: number;
  userGivenName: string;
  userFamilyName: string;
  userEmail: string;
}

export interface UserResponse {
  userID: number;
  userGivenName: string;
  userFamilyName: string;
  userEmail: string;
  createdDateTime: string;
  updatedDateTime: string;
  lastLoginDateTime: string | null;
}

export interface CreateUserRequest {
  userGivenName: string;
  userFamilyName: string;
  userEmail: string;
  userPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  userEmail: string;
}

export interface LoginRequest {
  userEmail: string;
  userPassword: string;
}

export interface UpdateUserRequest {
  userGivenName: string;
  userFamilyName: string;
  userEmail: string;
}
