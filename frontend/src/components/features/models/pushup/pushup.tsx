import * as tf from "@tensorflow/tfjs";

class Pushup {
  private trainedModel: tf.LayersModel | null = null;
  public loaded: boolean = false;

  async loadModel() {
    try {
      await tf.ready();
      console.log("TensorFlow backend ready:", tf.getBackend());

      this.trainedModel = await tf.loadLayersModel("/pushup-model/model.json");
      this.loaded = true;
      console.log("Model loaded successfully");
    } catch (error) {
      console.error("Failed to load model:", error);
      throw error;
    }
  }

  async predict(frames: number[][]) {
    if (!this.trainedModel) {
      console.error("Model not loaded. Call loadModel() first.");
      return null;
    }

    try {
      const inputTensor = tf.tensor3d([frames]);
      const prediction = this.trainedModel.predict(inputTensor) as tf.Tensor;
      const score = (await prediction.data())[0];

      inputTensor.dispose();
      prediction.dispose();

      //   console.log("Prediction score:", score);
      return score;
    } catch (error) {
      console.error("Prediction failed:", error);
      return null;
    }
  }

  detectPushupState(
    pose,
    currentStateRef,
    previousElbowAngleRef,
    stateFrameCountRef,
  ) {
    const rightShoulder = pose.keypoints.find(
      (kp) => kp.name === "right_shoulder",
    );
    const rightElbow = pose.keypoints.find((kp) => kp.name === "right_elbow");
    const rightWrist = pose.keypoints.find((kp) => kp.name === "right_wrist");
    const leftShoulder = pose.keypoints.find(
      (kp) => kp.name === "left_shoulder",
    );
    const leftElbow = pose.keypoints.find((kp) => kp.name === "left_elbow");
    const leftWrist = pose.keypoints.find((kp) => kp.name === "left_wrist");
    const hip = pose.keypoints.find((kp) => kp.name === "right_hip");
    const rightAnkle = pose.keypoints.find((kp) => kp.name === "right_ankle");

    if (!rightShoulder || !hip || !rightAnkle) {
      return currentStateRef.current;
    }

    // Calculate angles
    const rightAngle =
      rightElbow && rightWrist
        ? this.calculateAngle(rightShoulder, rightElbow, rightWrist)
        : null;
    const leftAngle =
      leftElbow && leftWrist
        ? this.calculateAngle(leftShoulder, leftElbow, leftWrist)
        : null;

    let elbowAngle;
    if (rightAngle && leftAngle) {
      elbowAngle = Math.min(rightAngle, leftAngle);
    } else {
      elbowAngle = rightAngle || leftAngle || 180;
    }

    // Direction
    const angleChange = elbowAngle - previousElbowAngleRef.current;
    const isGoingDown = angleChange < -1;
    const isGoingUp = angleChange > 1;
    previousElbowAngleRef.current = elbowAngle;

    // Torso
    const torsoAngle = Math.abs(
      (Math.atan2(hip.y - rightShoulder.y, hip.x - rightShoulder.x) * 180) /
        Math.PI,
    );

    const legAngle = Math.abs(
      Math.atan2(rightAnkle.y - hip.y, rightAnkle.x - hip.x) * (180 / Math.PI),
    );

    // console.log(`Leg Angle: ${legAngle.toFixed(2)}`);

    // Standing
    if ((torsoAngle > 65 && torsoAngle < 115) || legAngle < 130) {
      // console.log(legAngle);
      return this.transitionTo("standing", currentStateRef, stateFrameCountRef);
    }

    // Horizontal
    if (torsoAngle < 30 || torsoAngle > 140) {
      // console.log('enterd?');
      let proposedState = currentStateRef.current;

      // State machine with hysteresis
      if (
        currentStateRef.current === "idle" ||
        currentStateRef.current === "standing"
      ) {
        // console.log(elbowAngle, 'ELBBOW ANGLE');
        if (elbowAngle > 150) proposedState = "plank";
      } else if (currentStateRef.current === "plank") {
        if (isGoingDown && elbowAngle < 145) proposedState = "going_down";
      } else if (currentStateRef.current === "going_down") {
        if (elbowAngle < 105) proposedState = "bottom";
      } else if (currentStateRef.current === "bottom") {
        if (isGoingUp && elbowAngle > 115) proposedState = "coming_up";
      } else if (currentStateRef.current === "coming_up") {
        if (elbowAngle > 150) proposedState = "plank";
      }

      return this.transitionTo(
        proposedState,
        currentStateRef,
        stateFrameCountRef,
      );
    }

    return currentStateRef.current;
  }
  transitionTo(newState, currentStateRef, stateFrameCountRef) {
    const MIN_STATE_FRAMES = 3;

    if (newState === currentStateRef.current) {
      stateFrameCountRef.current++;
      return currentStateRef.current;
    }

    // Trying to change state - need MIN_STATE_FRAMES confidence
    if (stateFrameCountRef.current < MIN_STATE_FRAMES) {
      stateFrameCountRef.current++;
      return currentStateRef.current; // Stay in current state
    }

    // Confident enough to transition
    currentStateRef.current = newState;
    stateFrameCountRef.current = 0;
    return currentStateRef.current;
  }
  calculateAngle(a, b, c) {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs((radians * 180) / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }
  resampleFrames(frames: number[][], targetLength: number): number[][] {
    const originalLength = frames.length;
    if (originalLength === targetLength) return frames;

    const resampled: number[][] = [];

    for (let i = 0; i < targetLength; i++) {
      const t = (i / (targetLength - 1)) * (originalLength - 1);
      const low = Math.floor(t);
      const high = Math.ceil(t);
      const alpha = t - low;

      if (high >= originalLength) {
        resampled.push(frames[originalLength - 1]);
      } else {
        // Linear interpolation between low and high
        const frame: number[] = [];
        for (let j = 0; j < frames[0].length; j++) {
          frame.push(frames[low][j] * (1 - alpha) + frames[high][j] * alpha);
        }
        resampled.push(frame);
      }
    }

    return resampled;
  }
  //add angles?
  flattenKeypoints(keypoints) {
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");

    const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");

    const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
    const hip = keypoints.find((kp) => kp.name === "right_hip");

    const torsoAngle = Math.abs(
      (Math.atan2(hip.y - rightShoulder.y, hip.x - rightShoulder.x) * 180) /
        Math.PI,
    );

    const rightAngle =
      rightElbow && rightWrist
        ? this.calculateAngle(rightShoulder, rightElbow, rightWrist)
        : null;
    const leftAngle =
      leftElbow && leftWrist
        ? this.calculateAngle(leftShoulder, leftElbow, leftWrist)
        : null;

    // Calculate shoulder width as normalization factor
    const shoulderWidth = Math.sqrt(
      Math.pow(rightShoulder.x - leftShoulder.x, 2) +
        Math.pow(rightShoulder.y - leftShoulder.y, 2),
    );

    // Shoulder midpoint as origin
    const originX = (leftShoulder.x + rightShoulder.x) / 2;
    const originY = (leftShoulder.y + rightShoulder.y) / 2;

    const flattened: any = [];

    keypoints.forEach((kp) => {
      // Normalize relative to shoulder midpoint and width
      const normalizedX = (kp.x - originX) / shoulderWidth;
      const normalizedY = (kp.y - originY) / shoulderWidth;

      flattened.push(normalizedX, normalizedY, kp.confidence); // Include confidence
    });

    if (rightAngle && leftAngle) {
      flattened.push(leftAngle / 180);
      flattened.push(rightAngle / 180);
    }

    flattened.push(torsoAngle / 180);

    return flattened; // 54 features per frame
  }
}

export default new Pushup();
