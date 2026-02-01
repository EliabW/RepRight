import type { CreateFrameRequest, FrameResponse } from "./frame";

export interface RepResponse {
  repID: number;
  repNumber: number;
  repScore: number;
  frames?: FrameResponse[];
}

export interface CreateRepRequest {
  repNumber: number;
  repScore?: number;
  frames?: CreateFrameRequest[];
}
