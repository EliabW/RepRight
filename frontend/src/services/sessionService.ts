import type { CreateSessionRequest, SessionResponse, UpdateSessionRequest } from "@/types/session";
import api from "./api";

export const sessionService = {
  getAllSessions: async () => {
    const response = await api.get<SessionResponse[]>(`/Sessions`);
    return response.data;
  },
  getSession: async (sessionId: number) => {
    const response = await api.get<SessionResponse>(`/Sessions/${sessionId}`);
    return response.data;
  },
  createSession: async (sessionData: CreateSessionRequest) => {
    const response = await api.post<SessionResponse>(`/Sessions`, sessionData);
    return response.data;
  },
  updateSession: async (sessionId: number, sessionData: UpdateSessionRequest) => {
    const response = await api.put<SessionResponse>(
      `/Sessions/${sessionId}`,
      sessionData,
    );
    return response.data;
  },
  deleteSession: async (sessionId: number) => {
    const response = await api.delete<void>(`/Sessions/${sessionId}`);
    return response.data;
  },
};
