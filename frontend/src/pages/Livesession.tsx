import { StatCard } from "@/components/features/dashboard/StatCard";
import { FeedbackCard } from "@/components/features/dashboard/FeedbackCard";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { Dumbbell, Flame, Trophy } from "lucide-react";
import { TableRow } from "@/components/features/dashboard/TableRow";
import { FormScoreProgressChart } from "@/components/features/dashboard/FormScoreProgressChart";
import { ExerciseBreakdownChart } from "@/components/features/dashboard/ExerciseBreakdownChart";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import p5 from "p5";
import Sketch from "react-p5";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useRef } from "react";
interface Keypoint {
  x: number;
  y: number;
  name: string;
  confidence: number;
}

interface Pose {
  keypoints: Keypoint[];
  skeleton: unknown[][];
}
interface ML5BodyPose {
  detectStart: (
    video: HTMLVideoElement,
    callback: (results: Pose[]) => void,
  ) => Promise<void>;
}
declare global {
  interface Window {
    ml5: {
      bodyPose: (model?: string, callback?: () => void) => Promise<ML5BodyPose>;
    };
  }
}

function LiveSession() {
  // these will eventually be fetched from the database
  const videoRef = useRef<p5.MediaElement | null>(null);
  const bodyPoseRef = useRef<ML5BodyPose | null>(null);
  const posesRef = useRef<Pose[]>([]);
  const lefteyeRef = useRef<Keypoint | null>(null);
  const righteyeRef = useRef<Keypoint | null>(null);
  const videoReadyRef = useRef(false);
  const allPosesRef = useRef<Record<string, unknown>[] | null>(null);
  const counterRef = useRef<number>(0);
  const readyRef = useRef<string>("Not Counting");
  // const cycle = useRef<Record>();
  const currentStateRef = useRef("idle");
  const stateFrameCountRef = useRef(0);
  const previousElbowAngleRef = useRef(180);
  const previousStateRef = useRef("idle");
  const collectedFramesRef = useRef<number[][]>([]);
  const vidName = useRef<string>("goodStanding.mp4");
  const ghost = useRef<unknown[]>([]);
  const displayGhost = useRef<boolean>(false);
  const ghostFrameIndex = useRef<number>(0);

  const preload = () => {
    console.log("ml5 available:", window.ml5);
  };

  // When you want the actual file:
  function downloadJSON() {
    const data = localStorage.getItem("pushup-training-data");

    if (!data) {
      alert("No data to download!");
      return;
    }

    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pushup-training-data.json";
    a.click();

    console.log("📥 Downloaded!");
  }
  function saveRepToJSON(repData: any, repType: "good_forms" | "bad_forms") {
    // Get existing data from localStorage (acts like a file)
    const existing = localStorage.getItem("pushup-training-data");

    let data;
    if (existing) {
      // File exists, load it
      data = JSON.parse(existing);
    } else {
      // File doesn't exist, create structure
      data = {
        good_forms: [],
        bad_forms: [],
      };
    }

    //Add new rep
    data[repType].push(repData);

    // Save back
    localStorage.setItem("pushup-training-data", JSON.stringify(data));

    console.log(
      `✅ Saved! Good: ${data.good_forms.length}, Bad: ${data.bad_forms.length}`,
    );
  }
  const videoLoaded = async (p5: p5) => {
    console.log("Video loaded!");

    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration();
    const fps = 30;
    const frameCount = Math.floor(duration * fps);
    let done = false;
    let lastTime = 0;
    let replay = false;

    console.log(`Duration: ${duration} seconds`);
    console.log(`Estimated frames: ${frameCount}`);

    video.elt.play().then(async () => {
      console.log("video playing");
      // Initialize bodyPose with the video
      try {
        // ml5.bodyPose() returns a promise that resolves to the detector
        bodyPoseRef.current = await window.ml5.bodyPose("MoveNet", () => {
          console.log("BodyPose model loaded");
        });
        allPosesRef.current = [];
        // Detect poses on the video
        if (bodyPoseRef.current) {
          await bodyPoseRef.current.detectStart(
            video.elt,
            (results: Pose[]) => {
              posesRef.current = results;
              if (results.length <= 0) return;
              const allPoses = allPosesRef.current;
              if (!allPoses) return;

              const t = video.elt.currentTime;

              // Detect wrap-around
              if (!replay) {
                if (t < lastTime && t < 0.1) {
                  replay = true;
                  console.log("🔁 loop detected");
                }

                lastTime = t;

                if (!replay) return;
              }

              const pose = results[0];

              const currentState = detectPushupState(pose);
              const previousState = previousStateRef.current;

              if (!done) console.log(`State: ${currentState}`);

              if (previousState === "idle" && currentState === "plank") {
                readyRef.current = "Counting";
              }

              const activeStates = [
                "plank",
                "going_down",
                "bottom",
                "coming_up",
              ];
              if (!done && activeStates.includes(currentState)) {
                const keyPoints = pose.keypoints;
                const flattened = flattenKeypoints(keyPoints);
                collectedFramesRef.current.push(flattened);
                ghost.current.push(pose);
              }

              if (
                !done &&
                previousState === "coming_up" &&
                currentState === "plank"
              ) {
                console.log("✅ REP COMPLETE!");
                console.log(`Frames: ${collectedFramesRef.current.length}`);
                counterRef.current++;

                // collectedFramesRef.current = [];
                done = true;
              }

              previousStateRef.current = currentState;
            },
          );
          video.elt.onended = () => {
            // console.log('replay started');
            // console.log('finished');
            // const allPoses = allPosesRef.current;
            // if (!allPoses) return;
            // processReps()
          };
          videoReadyRef.current = true;
          console.log("Detection started");
        }
      } catch (error) {
        console.error("Error initializing bodyPose:", error);
      }
    });
  };

  function detectPushupState(pose) {
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
        ? calculateAngle(rightShoulder, rightElbow, rightWrist)
        : null;
    const leftAngle =
      leftElbow && leftWrist
        ? calculateAngle(leftShoulder, leftElbow, leftWrist)
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
      return transitionTo("standing");
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

      return transitionTo(proposedState);
    }

    return currentStateRef.current;
  }

  function transitionTo(newState) {
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

  function calculateAngle(a, b, c) {
    const radians =
      Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs((radians * 180) / Math.PI);
    if (angle > 180) angle = 360 - angle;
    return angle;
  }

  function resampleFrames(
    frames: number[][],
    targetLength: number,
  ): number[][] {
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
  function flattenKeypoints(keypoints) {
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
        ? calculateAngle(rightShoulder, rightElbow, rightWrist)
        : null;
    const leftAngle =
      leftElbow && leftWrist
        ? calculateAngle(leftShoulder, leftElbow, leftWrist)
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

  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);

    // const vid = p5.createVideo(`/${vidName.current}`, () => videoLoaded(p5));
    // videoRef.current = vid;

    // vid.elt.onerror = (e: Error) => {
    //   console.error("Video failed to load:", e);
    //   console.error("Video src:", vid.elt.src);
    // };

    // vid.elt.muted = true;

    // vid.size(640, 480);
    // vid.hide();

    // vid.loop();
    // vid.volume(0);

    // const vid = p5.createCapture((p5 as any).VIDEO, () =>
    //   videoLoaded(p5),
    // ) as p5.MediaElement;
    // videoRef.current = vid;

    // vid.size(p5.windowWidth, p5.windowHeight);
    // vid.hide();
  };

  const draw = (p5: p5) => {
    const video = videoRef.current;

    if (!videoReadyRef.current || !video) {
      p5.background(0);
      p5.fill(255);
      p5.textSize(24);
      p5.text("Loading video...", 20, p5.height / 2);
      return;
    }

    p5.image(video, 0, 0, p5.width, p5.height);

    if (posesRef.current.length === 0) return;

    const pose = posesRef.current[0];

    for (const kp of pose.keypoints) {
      if (kp.name === "left_eye") {
        lefteyeRef.current = kp;
      }
      if (kp.name === "right_eye") {
        righteyeRef.current = kp;
      }

      p5.fill(255, 0, 0);
      p5.noStroke();
      p5.circle(kp.x, kp.y, 10);
    }

    if (righteyeRef.current && lefteyeRef.current) {
      p5.stroke(0, 255, 0);
      p5.strokeWeight(2);
      p5.line(
        lefteyeRef.current.x,
        lefteyeRef.current.y,
        righteyeRef.current.x,
        righteyeRef.current.y,
      );
    }

    p5.noStroke();
    p5.fill(0, 255, 0);
    p5.textSize(32);
    p5.text(`Reps: ${counterRef.current}`, 10, 40);

    p5.fill(0, 0, 0);
    p5.noStroke();
    p5.text(`Status: ${readyRef.current}`, 10, 80);

    // console.log(detectPushupState(pose));
  };

  return (
    <div className="relative w-screen h-screen">
      <Card className="rounded-xl overflow-hidden w-full h-full">
        <Sketch setup={setup} draw={draw} preload={preload} />
      </Card>

      <div className="absolute top-8 right-8">
        <Card className="bg-card-secondary p-4 w-64 rounded-xl">
          <p>Time Elapsed: 0:28</p>
          <p>Reps: 10</p>
        </Card>
      </div>
    </div>
  );
}

export default LiveSession;
