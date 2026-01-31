import { ExerciseCard } from "@/components/features/dashboard/ExerciseCard";

function ExerciseLibrary() {
  // these will eventually be fetched from the database
  const averageScore = 7.2;

  return (
    <div>
      
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
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
      
      <div className="p-6 max-w-8xl mx-auto">
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
      </div>
    </div>
  );
}

export default ExerciseLibrary;
