import type { CreateRepRequest, RepResponse } from "./rep";

export interface Session {
  sessionID: number;
  userID: number;
  sessionType: string;
  startTime: string;
  sessionReps: number;
  sessionScore: number | null;
  sessionFeedback: string | null;
  sessionDurationSec: number;
  repScores?: number[];
}

export interface SessionResponse {
  sessionID: number;
  sessionType: string;
  startTime: string;
  sessionReps: number;
  sessionScore: number;
  sessionFeedback: string;
  sessionDurationSec: number;
  reps?: RepResponse[];
}

export interface CreateSessionRequest {
  sessionType: string;
  startTime?: string;
  sessionReps?: number;
  sessionScore?: number;
  sessionFeedback?: string;
  sessionDurationSec?: number;
  reps?: CreateRepRequest[];
}

export interface UpdateSessionRequest {
  sessionType?: string;
  startTime?: string;
  sessionReps?: number;
  sessionScore?: number;
  sessionFeedback?: string;
  sessionDurationSec?: number;
  reps?: CreateRepRequest[];
}
