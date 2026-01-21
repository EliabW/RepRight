import { Star } from "lucide-react";

interface ScoreBadgeProps {
  score: number;
  text?: string;
}

// helper function to get precise score color based on 0-10 scale
const getScoreColor = (score: number) => {
  // clamp score between 0 and 10
  const clampedScore = Math.max(0, Math.min(10, score));

  // calculate RGB values for a gradient from red (0) to green (10)

  if (clampedScore <= 5) {
    const ratio = clampedScore / 5;
    const r = Math.round(220 + (234 - 220) * ratio);
    const g = Math.round(38 + (179 - 38) * ratio);
    const b = Math.round(38 + (8 - 38) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    const ratio = (clampedScore - 5) / 5;
    const r = Math.round(234 + (22 - 234) * ratio);
    const g = Math.round(179 + (163 - 179) * ratio);
    const b = Math.round(8 + (74 - 8) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export function ScoreBadge({ score, text = "Score" }: ScoreBadgeProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card-secondary border border-subtle">
      <Star className="w-5 h-5 text-subheading" />
      <p className="text-sm font-semibold">{text}</p>
      <p
        className="text-white font-bold text-lg px-3 py-1 rounded-full"
        style={{ backgroundColor: getScoreColor(score) }}
      >
        {score.toFixed(1)}
      </p>
    </div>
  );
}
