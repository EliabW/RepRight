import api from "./api";
import type {
  CreateUserRequest,
  LoginRequest,
  LoginResponse,
  UserResponse,
} from "@/types";

export const authService = {
  register: async (userData: CreateUserRequest) => {
    const response = await api.post<LoginResponse>("/User", userData);
    return response.data;
  },
  login: async (credentials: LoginRequest) => {
    const response = await api.post<LoginResponse>("/User/login", credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get<UserResponse>("/User/current");
    return response.data;
  },
  // eventually implement forgotPassword and resetPassword here
};
