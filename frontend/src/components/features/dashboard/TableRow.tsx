import { FancyButton } from "@/components/ui/fancybutton";
import { ScoreBadge } from "./ScoreBadge";
import { Card } from "@/components/ui/card";

interface TableRowProps {
  exercise: string;
  date: string;
  reps: string;
  seconds: number;
  score: number;
}

export function TableRow({
  exercise,
  date,
  reps,
  seconds,
  score,
}: TableRowProps) {
  return (
    <Card className="flex items-center justify-between bg-card-secondary rounded-lg p-3 shadow-sm">
      <div className="flex gap-12">
        {/* exercise and date */}
        <div className="flex flex-col">
          <span className="text-lg font-semibold">{exercise}</span>
          <span className="text-xs text-subheading">{date}</span>
        </div>
        {/* reps and time */}
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2 rounded-full text-md">{reps} reps</Card>
          <Card className="px-4 py-2 rounded-full text-md">{seconds} sec</Card>
        </div>
      </div>

      {/* score and button */}
      <div className="flex items-center gap-4">
        <ScoreBadge score={score} />
        <FancyButton>View Full Report</FancyButton>
      </div>
    </Card>
  );
}
