import { FancyButton } from "@/components/ui/fancybutton";
import { ScoreBadge } from "./ScoreBadge";

interface FeedbackCardProps {
  exercise: string;
  feedback: string;
  imageSrc: string;
  score: number;
  // click handler for view full report button
  onViewDetails?: () => void;
}

export function FeedbackCard({
  exercise,
  feedback,
  imageSrc,
  score,
  onViewDetails,
}: FeedbackCardProps) {
  return (
    <div className="bg-card-secondary border border-subtle p-6 rounded-xl flex flex-col sm:flex-row gap-6">
      <img
        src={imageSrc}
        alt={exercise}
        className="w-full sm:w-52 h-52 rounded-xl object-cover"
      />

      <div className="flex flex-col flex-1 justify-between">
        <h3 className="text-2xl font-semibold">{exercise} Analysis</h3>
        <div className="flex">
          <ScoreBadge score={score} />
        </div>

        <p className="text-sm text-subheading pb-5">{feedback}</p>
        
        {/* Replace the old Button with "FancyButton" */}
        <FancyButton>View Full Report</FancyButton>
      </div>
    </div>
  );
}