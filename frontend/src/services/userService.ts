import api from "./api";
import type {
  UpdateUserRequest,
  ChangePasswordRequest,
  UserResponse,
} from "@/types";

export const userService = {
  getUser: async (userId: number) => {
    const response = await api.get<UserResponse>(`/User/${userId}`);
    return response.data;
  },
  updateUser: async (userId: number, userData: UpdateUserRequest) => {
    const response = await api.put<UserResponse>(`/User/${userId}`, userData);
    return response.data;
  },
  changePassword: async (
    userId: number,
    passwordData: ChangePasswordRequest
  ) => {
    const response = await api.put<void>(
      `/User/${userId}/password`,
      passwordData
    );
    return response.data;
  },
  deleteUser: async (userId: number) => {
    const response = await api.delete<void>(`/User/${userId}`);
    return response.data;
  },
};
