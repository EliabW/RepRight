import { Star, Target } from "lucide-react";
import Header from "@/components/layout/Header";

// fake data
const exercises = [
  {
    id: 1,
    title: "Squat",
    feedback:
      "Ensure your back is very straight and drive through your heels on the way up through the movement.",
    img: "/squat.jpg",
    score: 9.0,
    muscles: "Quads, Hamstrings, Lower Back",
  },
  {
    id: 2,
    title: "Push up",
    feedback:
      "Go all the way until you almost touch the floor, then push while keeping your back and hips aligned.",
    img: "/Push up.jpg",
    score: 5.4,
    muscles: "Chest, Triceps",
  },
];

function ExerciseLibrary() {
  return (
    <div>
      <Header></Header>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid xl:grid-cols-2 gap-6">
          {exercises.map((ex) => (
            // image section
            <div
              key={ex.id}
              className="bg-card primary p-6 rounded-xl flex flex-col sm:flex-row gap-6"
            >
              <img
                src={ex.img}
                alt={ex.title}
                className="w-full sm:w-56 h-56 rounded-xl"
              />

              {/* info section */}
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <p className="text-xs text-subheading">Exercise Tips</p>
                  <h3 className="text-3xl">{ex.title}</h3>
                  <p className="text-sm text-subheading">{ex.feedback}</p>
                </div>

                {/* score badge */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-end gap-2 px-4 py-2 rounded-full bg-subtle self-end">
                    <Star className="w-5 h-5" />
                    <p className="text-xs">Average Score</p>
                    <p className="bg-subheading text-white font-bold text-lg px-3 py-1 rounded-full">
                      {ex.score.toFixed(1)}
                    </p>
                  </div>

                  {/* muscle tag */}
                  <div className="flex items-center gap-2 bg-subtle px-4 py-2 rounded-full self-end">
                    <Target className="w-5 h-5 text-subheading"></Target>
                    <p className="text-sm font-semibold text-primary">
                      {ex.muscles}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExerciseLibrary;
