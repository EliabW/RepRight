import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { SessionResponse } from "@/types/session";

interface ExerciseBreakdownChartProps {
  sessions?: SessionResponse[];
}

// color palette for bars

const colors = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
];

export function ExerciseBreakdownChart({
  sessions = [],
}: ExerciseBreakdownChartProps) {
  // Group sessions by exercise type and count them
  const exerciseCounts = sessions.reduce(
    (acc, session) => {
      const exerciseType = session.sessionType;
      acc[exerciseType] = (acc[exerciseType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Convert to array format for chart
  const chartData = Object.entries(exerciseCounts)
    .map(([exercise, count]) => ({
      exercise,
      count,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-subheading">No exercise data available</p>
      </div>
    );
  }


  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgb(var(--subtle))"
          opacity={0.3}
        />
        <XAxis
          dataKey="exercise"
          stroke="rgb(var(--subheading))"
          style={{ fontSize: "10px" }}
          tick={{ fill: "rgb(var(--subheading))" }}
        />
        <YAxis
          stroke="rgb(var(--subheading))"
          style={{ fontSize: "12px" }}
          tick={{ fill: "rgb(var(--subheading))" }}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(var(--card-primary))",
            border: "1px solid rgb(var(--subtle))",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "rgb(var(--subheading))" }}
          cursor={{ fill: "#976e4c1a" }}
        />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {chartData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
