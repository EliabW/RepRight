export interface Session {
  sessionID: number;
  userID: number;
  sessionType: string;
  startTime: string;
  sessionReps: number;
  sessionScore: number | null;
  sessionFeedback: string | null;
  sessionDurationSec: number;
}

export interface SessionResponse {
  sessionID: number;
  sessionType: string;
  startTime: string;
  sessionReps: number;
  sessionScore: number;
  sessionFeedback: string;
  sessionDurationSec: number;
}

export interface CreateSessionRequest {
  sessionType: string;
  startTime?: string;
  sessionReps?: number;
  sessionScore?: number;
  sessionFeedback?: string;
  sessionDurationSec?: number;
}

export interface UpdateSessionRequest {
  sessionType?: string;
  startTime?: string;
  sessionReps?: number;
  sessionScore?: number;
  sessionFeedback?: string;
  sessionDurationSec?: number;
}
