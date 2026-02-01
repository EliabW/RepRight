export interface KeypointData {
  x: number;
  y: number;
}

export interface FrameResponse {
  frameID: number;
  frameNumber: number;
  nose?: KeypointData;
  leftEye?: KeypointData;
  rightEye?: KeypointData;
  leftEar?: KeypointData;
  rightEar?: KeypointData;
  leftShoulder?: KeypointData;
  rightShoulder?: KeypointData;
  leftElbow?: KeypointData;
  rightElbow?: KeypointData;
  leftWrist?: KeypointData;
  rightWrist?: KeypointData;
  leftHip?: KeypointData;
  rightHip?: KeypointData;
  leftKnee?: KeypointData;
  rightKnee?: KeypointData;
  leftAnkle?: KeypointData;
  rightAnkle?: KeypointData;
}

export interface CreateFrameRequest {
  frameNumber: number;
  nose?: KeypointData;
  leftEye?: KeypointData;
  rightEye?: KeypointData;
  leftEar?: KeypointData;
  rightEar?: KeypointData;
  leftShoulder?: KeypointData;
  rightShoulder?: KeypointData;
  leftElbow?: KeypointData;
  rightElbow?: KeypointData;
  leftWrist?: KeypointData;
  rightWrist?: KeypointData;
  leftHip?: KeypointData;
  rightHip?: KeypointData;
  leftKnee?: KeypointData;
  rightKnee?: KeypointData;
  leftAnkle?: KeypointData;
  rightAnkle?: KeypointData;
}
