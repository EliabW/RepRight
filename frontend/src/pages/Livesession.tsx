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
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import pushup from "@/components/features/models/pushup/pushup";
import { Button } from "@/components/ui/button";
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
  const location = useLocation();
  const exercise: string = location.state?.exercise || "Pushup";
  const reps: number = location.state?.reps || 10;
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
  const [repCount, setRepCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const start = Date.now();

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - start) / 1000);
      setElapsedTime(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const preload = async () => {
    console.log("ml5 available:", window.ml5);
    console.log(exercise, reps);

    await pushup.loadModel();
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
    const done = false;
    const lastTime = 0;
    const replay = false;

    // console.log(`Duration: ${duration} seconds`);
    // console.log(`Estimated frames: ${frameCount}`);

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
            async (results: Pose[]) => {
              posesRef.current = results;
              if (results.length <= 0) return;
              const allPoses = allPosesRef.current;
              if (!allPoses) return;

              //   const t = video.elt.currentTime;
              //   console.log("hello");

              //   // Detect wrap-around
              //   if (!replay) {
              //     if (t < lastTime && t < 0.1) {
              //       replay = true;
              //       console.log("🔁 loop detected");
              //     }

              //     lastTime = t;

              //     if (!replay) return;
              //   }
              //   console.log("detecting");

              const pose = results[0];

              const currentState = pushup.detectPushupState(
                pose,
                currentStateRef,
                previousElbowAngleRef,
                stateFrameCountRef,
              );
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
                const flattened = pushup.flattenKeypoints(keyPoints);
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
                setRepCount(counterRef.current);

                const normalizedSequence = pushup.resampleFrames(
                  collectedFramesRef.current,
                  150,
                );
                collectedFramesRef.current = [];
                const predition = await pushup.predict(normalizedSequence);
                console.log("Prediction:", predition);

                // done = true;
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
          <p>Time Elapsed: {formatTime(elapsedTime)}</p>
          <p>Reps: {repCount}</p>
          <Button className="mt-2" onClick={() => {}}>
            Finish Session
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default LiveSession;
