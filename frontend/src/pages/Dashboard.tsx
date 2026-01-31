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
import { useEffect, useState } from "react";
import { sessionService } from "@/services/sessionService";
import type { SessionResponse } from "@/types/session";
import p5 from "p5";
import Sketch from "react-p5";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import "animate.css";

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
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setIsLoading(true);
        // fetch sessions from the currently logged in user
        const sessions = await sessionService.getAllSessions();
        setSessions(sessions);
        setError(null);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setError("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const { user } = useAuth();

  const stats = {
    recentScore:
      sessions.length > 0
        ? (sessions[0].sessionScore?.toFixed(1) ?? "N/A")
        : "N/A",
    totalExercises: sessions.length,
    loginStreak: user?.currentStreak ?? 0,
  };

  const latestSessionWithFeedback = sessions.find(
    (s) => s.sessionFeedback && s.sessionFeedback.trim() !== "",
  );

  const recentSessions = sessions.slice(0, 20);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
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

<div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <img
          src="/android-chrome-512x512.png"
          alt="RepRight Logo"
          className="w-[700px] opacity-[0.05] dark:hidden"
        />
        <img
          src="/white-android-chrome-512x512.png"
          alt="RepRight Logo"
          className="w-[520px] opacity-[0.06] hidden dark:block"
        />
      </div>

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
        <h1 className="text-5xl text-secondary pr-2 animate__animated animate__bounce">Welcome back,</h1>
        <span className="text-5xl text-primary font-bold animate__animated animate__bounce">
          {user?.userGivenName}
        </span>
        <h1 className="text-5xl text-secondary">!</h1>
      </div>
      <h2 className="text-7sm">Track your progress and improve your form.</h2>

      {/* stat cards */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10 mt-8 animate__animated animate__zoomIn">
        <StatCard
          title="Recent Score"
          value={stats.recentScore}
          secondValue="/10"
          icon={Trophy}
        />
        <StatCard
          title="Exercises Completed"
          value={stats.totalExercises.toString()}
          secondValue=""
          icon={Dumbbell}
        />
        <StatCard
          title="Login Streak"
          value={stats.loginStreak.toString()}
          secondValue="Days"
          icon={Flame}
        />
      </div>
      {/* performance overview and latest feedback */}
      <div className="grid lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 gap-6 mt-20 animate__animated animate__zoomIn">
        {/* hide if on mobile */}
        {isDesktop && (
          <Card className="p-20">
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
        <Card className="p-20">

          <h1 className="text-md text-subheading mb-2 ">Latest Feedback</h1>
          <Separator className="mb-8" />
          {latestSessionWithFeedback ? (
            <FeedbackCard
              exercise={latestSessionWithFeedback.sessionType}
              feedback={latestSessionWithFeedback.sessionFeedback!}
              // map based on exercise type
              imageSrc="../../images/squat.png"
              score={latestSessionWithFeedback.sessionScore ?? 0}
            />
          ) : (
            <p className="text-sm text-gray-500">No feedback available yet.</p>
          )}
        </Card>
      </div>
      {/* exercise feedback */}
      <div className="grid grid-cols-1 gap-6 mt-20 animate__animated animate__bounceInLeft animate__delay-1s">
        {/* hide if on mobile */}
        {isDesktop && (
          <Card className="p-4 ">
            <h1 className="text-md text-subheading mb-2">Exercise Feedback</h1>
            <Separator className="mb-4" />
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <TableRow
                  key={session.sessionID}
                  exercise={session.sessionType}
                  date={new Date(session.startTime).toLocaleDateString()}
                  reps={session.sessionReps.toString()}
                  seconds={session.sessionDurationSec}
                  score={session.sessionScore ?? 0}
                />
              ))
            ) : (
              <p className="text-sm text-subheading">No recent sessions.</p>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
export default Dashboard;
