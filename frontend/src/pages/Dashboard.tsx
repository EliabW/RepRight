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

function Dashboard() {
  const { user } = useAuth();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(350, 200).parent(canvasParentRef);
  };

  const draw = (p5: p5) => {
    const video = false;

    if (!video) {
      p5.background(0);
      p5.fill(255);
      p5.textSize(24);
      p5.text("Loading video...", 20, p5.height / 2);
      return;
    }
  };

  const preload = () => {
    console.log("ml5 available:", window.ml5);
  };

  return (
    <div className="p-8">
      {/* header */}
      <Dialog open={false}>
        {/* <DialogOverlay className="backdrop-blur-xs" /> */}
        <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-card-primary overflow-y-auto shadow-2xl rounded-xl">
          <DialogTitle>Squat Analysis</DialogTitle>
          {/* <DialogDescription className="-mt-1 mb-1 ">
            Edit the details of the transaction
          </DialogDescription> */}
          <div className="mt-4  p-4 rounded-lg flex flex-row justify-between">
            <Card className="bg-card-secondary p-4 max-w-xs rounded-xl">
              <p>01/05/2026</p>
              <br />
              <p>8 reps</p>
              <br />
              <p>30 seconds</p>
            </Card>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <Card className="rounded-xl overflow-hidden">
              <Sketch preload={preload} setup={setup} draw={draw} />
            </Card>
          </div>
          <div className="w-[100%] h-px bg-slate-400 rounded-full"></div>
          <h1 className="text-lg font-bold mt-4">Feedback</h1>
          <p className="mt-2 mb-4 max-w-xs">
            Good job! Keep your back straighter on the descent and drive through
            your heels on the way up
          </p>
          <div className="w-[100%] h-px bg-slate-400 rounded-full"></div>
          <h1 className="text-lg font-bold mt-4 mb-4">
            Squat Form Score Progress
          </h1>
          <div className="w-[90%] h-[180px]">
            <FormScoreProgressChart />
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex">
        <h1 className="text-3xl text-secondary pr-2">Welcome back,</h1>
        <span className="text-3xl text-primary font-bold">
          {user?.userGivenName}
        </span>
        <h1 className="text-3xl text-secondary">!</h1>
      </div>
      <h2 className="text-sm">Track your progress and improve your form.</h2>

      {/* stat cards */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">
        <StatCard
          title="Recent Score"
          value="8.2"
          secondValue="/10"
          icon={Trophy}
        />
        <StatCard
          title="Exercises Completed"
          value="24"
          secondValue=""
          icon={Dumbbell}
        />
        <StatCard
          title="Login Streak"
          value="10"
          secondValue="Days"
          icon={Flame}
        />
      </div>
      {/* performance overview and latest feedback */}
      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-8">
        {/* hide if on mobile */}
        {isDesktop && (
          <Card className="p-4">
            <h1 className="text-md text-subheading mb-2">
              Performance Overview
            </h1>
            <Separator className="mb-2" />
            {/* placeholder for performance charts */}
            <div className="flex grid grid-cols-2 gap-4 px-2">
              <div>
                <h2 className="py-2 text-sm text-subheading">
                  Form Score Progress
                </h2>
                <Card className="h-56 flex items-center justify-center bg-card-secondary rounded-xl pr-8 pt-4">
                  <FormScoreProgressChart />
                </Card>
              </div>
              <div>
                <h2 className="py-2 text-sm text-subheading">
                  Exercise Breakdown
                </h2>
                <Card className="h-56 flex items-center justify-center bg-card-secondary rounded-xl pr-8 pt-4">
                  <ExerciseBreakdownChart />
                </Card>
              </div>
            </div>
          </Card>
        )}
        <Card className="p-4">
          <h1 className="text-md text-subheading mb-2">Latest Feedback</h1>
          <Separator className="mb-4" />
          <FeedbackCard
            exercise="Squat"
            feedback="Great depth and form! Remember to keep your back straight and engage your core throughout the movement."
            imageSrc="../../images/squat.png"
            score={9}
          />
        </Card>
      </div>
      {/* exercise feedback */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        {/* hide if on mobile */}
        {isDesktop && (
          <Card className="p-4">
            <h1 className="text-md text-subheading mb-2">Exercise Feedback</h1>
            <Separator className="mb-4" />
            <TableRow
              exercise="Squat"
              date="1/5/2026"
              reps="10"
              seconds={30}
              score={9}
            />
            <TableRow
              exercise="Push Up"
              date="1/4/2026"
              reps="15"
              seconds={30}
              score={4.2}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
