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

  return (
    <div className="p-8">
      {/* header */}
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
      <div className="grid grid-cols-1 gap-6 mt-8">
        {/* hide if on mobile */}
        {isDesktop && (
          <Card className="p-4">
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
