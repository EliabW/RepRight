import { Target } from "lucide-react";
import { ScoreBadge } from "./ScoreBadge";

interface ExerciseCardProps {
  title: string;
  feedback: string;
  imageSrc: string;
  averageScore: number;
  muscles: string;
}

export function ExerciseCard({
  title,
  feedback,
  imageSrc,
  averageScore,
  muscles,
}: ExerciseCardProps) {
  return (
    <div className="bg-card-primary border border-subtle p-6 rounded-xl flex flex-col sm:flex-row gap-6">
      <img
        src={imageSrc}
        alt={title}
        className="w-full sm:w-52 h-52 rounded-xl object-cover"
      />

      {/* info section */}
      <div className="flex flex-col flex-1 justify-between">
        {/* top row */}
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs text-subheading">Exercise Tips</p>
            <h3 className="text-3xl font-bold text-secondary">{title}</h3>
          </div>
          <ScoreBadge score={averageScore} text="Average Score" />
        </div>

        {/* feedback (full width, below top row) */}
        <p className="text-sm text-subheading mt-3">{feedback}</p>

        {/* muscle tag */}
        <div className="flex items-center gap-2 bg-card-secondary border border-subtle px-4 py-2 rounded-full self-end">
          <Target className="w-5 h-5 text-subheading" />
          <p className="text-sm font-semibold text-secondary">{muscles}</p>
        </div>
      </div>
    </div>
  );
}
