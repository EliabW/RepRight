import { useEffect, useState } from "react";
import { ExerciseCard } from "@/components/features/dashboard/ExerciseCard";
import { sessionService } from "@/services/sessionService";
import type { SessionResponse } from "@/types/session";

const exerciseImageMap: Record<string, string> = {
  Squat: "../../images/squat.png",
  Pushup: "../../images/pushup.png",
  Deadlift: "../../images/deadlift.png",
  BenchPress: "../../images/benchpress.png",
};

const muscleMaps: Record<string, string> = {
  Squat: "Quads, Hamstrings, Lower Back",
  Pushup: "Chest, Triceps",
  Deadlift: "Hamstrings, Lower Back",
  BenchPress: "Chest, Triceps",
};

const getExerciseImage = (exerciseType: string): string => {
  return exerciseImageMap[exerciseType] || "../../images/default-exercise.png";
};

const getMuscleTargets = (exerciseType: string): string => {
  return muscleMaps[exerciseType] || "Full Body";
};

function ExerciseLibrary() {
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

  // group and calculate averages
  const processedExercises = sessions.reduce((total, session) => {
    const exerciseType = session.sessionType;

    // make sure there is only one exercise type
    if (!total[exerciseType]) {
      total[exerciseType] = { totalScore: 0, count: 0, feedback: "" };
    }

    // summing the scores and counting occurrences
    total[exerciseType].totalScore += session.sessionScore;
    total[exerciseType].count += 1;

    // store the latest feedback to display on the card
    total[exerciseType].feedback = session.sessionFeedback;

    return total;
  }, {} as Record<string, { totalScore: number; count: number; feedback: string }>);

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

  // these will eventually be fetched from the database

  return (
    <div>
      
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none ">
        <img
          src="/android-chrome-512x512.png"
          alt="RepRight Logo"
          className="w-[700px] opacity-[0.04] dark:hidden"
        />
        <img
          src="/white-android-chrome-512x512.png"
          alt="RepRight Logo"
          className="w-[520px] opacity-[0.06] hidden dark:block"
        />
      </div>
      
      <div className="p-6 max-w-8xl mx-auto animate__animated animate__zoomIn">
        <div className="grid xl:grid-cols-2 gap-6">
          <ExerciseCard
            title="Squat"
            feedback="Ensure your back is very straight and drive through your heels on the way up through the movement."
            imageSrc="../../images/squat.png"
            averageScore={averageScore}
            muscles="Quads, Hamstrings, Lower Back"
          />

          <ExerciseCard
            title="Push Up"
            feedback="Go all the way until you almost touch the floor, then push while keeping your back and hips aligned."
            imageSrc="../../images/pushup.png"
            averageScore={3.2}
            muscles="Chest, Triceps"
          />
          <ExerciseCard
            title="Bench Press"
            feedback="Maintain a small gap between your mid-back and the bench, maintaining stability and increasing strength."
            imageSrc="../../images/benchpress.png"
            averageScore={1.2}
            muscles="Chest, Shoulders, Triceps"
          />
          <ExerciseCard
            title="Deadlift"
            feedback="Don’t bend your spine while lifting, use a lifting belt to ensure safety."
            imageSrc="../../images/deadlift.png"
            averageScore={9.7}
            muscles="Back, Glutes, Hamstrings"
          />
        </div>
    <div className="p-6 max-w-8xl mx-auto">
      <div className="grid xl:grid-cols-2 gap-6">
        {/* if there is data */}
        {Object.keys(processedExercises).length > 0 ? (
          Object.entries(processedExercises).map(([type, stats]) => {
            // get the average
            const averageScore = stats.totalScore / stats.count;

            return (
              <ExerciseCard
                title={type}
                feedback={stats.feedback}
                imageSrc={getExerciseImage(type)}
                averageScore={averageScore}
                muscles={getMuscleTargets(type)}
              />
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center">
            <p className="text-3xl text-primary">No Workout History Found.</p>
            <p className="text-xl text-secondary">
              Start your first session to see your performance breakdown here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseLibrary;
