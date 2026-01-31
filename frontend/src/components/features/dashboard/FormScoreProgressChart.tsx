import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { SessionResponse } from "@/types/session";

interface FormScoreProgressChartProps {
  sessions?: SessionResponse[];
}

export function FormScoreProgressChart({
  sessions = [],
}: FormScoreProgressChartProps) {
  const chartData = sessions
    .filter((s) => s.sessionScore !== null && s.sessionScore !== undefined)
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .map((session, index) => ({
      sessionNumber: index + 1,
      score: session.sessionScore!,
      date: new Date(session.startTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

  const scores = chartData.map((d) => d.score);
  const minScore = scores.length > 0 ? Math.floor(Math.min(...scores)) : 0;
  const maxScore = scores.length > 0 ? Math.ceil(Math.max(...scores)) : 10;

  const yMin = Math.max(0, minScore - 1);
  const yMax = Math.min(10, maxScore + 1);

  if (chartData.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-subheading">No score data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#976E4C" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#976E4C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgb(var(--subtle))"
          opacity={0.3}
        />
        <XAxis
          dataKey="sessionNumber"
          stroke="rgb(var(--subheading))"
          style={{ fontSize: "12px" }}
          tick={{ fill: "rgb(var(--subheading))" }}
        />
        <YAxis
          domain={[yMin, yMax]}
          stroke="rgb(var(--subheading))"
          style={{ fontSize: "12px" }}
          tick={{ fill: "rgb(var(--subheading))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(var(--card-primary))",
            border: "1px solid rgb(var(--subtle))",
            borderRadius: "8px",
            color: "rgb(var(--secondary))",
          }}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return `Session ${payload[0].payload.sessionNumber} - ${payload[0].payload.date}`;
            }
            return `Session ${label}`;
          }}
          labelStyle={{ color: "rgb(var(--subheading))" }}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#976E4C"
          strokeWidth={2}
          fill="url(#scoreGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
