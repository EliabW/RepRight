import type { CreateSessionRequest, SessionResponse } from "@/types/session";
import api from "./api";
import type { FrameResponse } from "@/types/frame";

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

  deleteSession: async (sessionId: number) => {
    const response = await api.delete<void>(`/Sessions/${sessionId}`);
    return response.data;
  },
  getRepFrames: async (sessionId: number, repNumber: number) => {
    const response = await api.get<FrameResponse[]>(
      `/Sessions/${sessionId}/reps/${repNumber}/frames`,
    );
    return response.data;
  },
};
