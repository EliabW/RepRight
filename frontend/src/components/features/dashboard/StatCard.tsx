import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface ScoreCardProps {
  title: string;
  value: string;
  secondValue?: string | undefined;
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  secondValue = "",
  icon: Icon,
}: ScoreCardProps) {
  return (
    <Card className="relative p-4 overflow-hidden bg-card-primary/60 backdrop-blur-md">
      {/* title */}
      <h2 className="text-md text-subheading">{title}</h2>

      {/* centered score */}
      <div className="flex items-center justify-center">
        <div className="flex items-end gap-1">
          <span className="text-5xl font-bold text-secondary">{value}</span>
          <span className="text-2xl text-subheading">{secondValue}</span>
        </div>
      </div>

      {/* faded score icon */}
      <Icon
        className="absolute right-6 top-1/2 -translate-y-1/2
               w-28 h-28 text-primary/10 rotate-12"
      />
    </Card>
  );
}
