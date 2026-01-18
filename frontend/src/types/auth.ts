import type { User } from "./user";

export interface LoginRequest {
  userEmail: string;
  userPassword: string;
}

export interface LoginResponse {
  userID: number;
  userGivenName: string;
  userFamilyName: string;
  userEmail: string;
  token: string;
  darkMode?: boolean;
}

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
  updateUser: (updatedUserData: User) => void;
  isAuthenticated: boolean;
}
