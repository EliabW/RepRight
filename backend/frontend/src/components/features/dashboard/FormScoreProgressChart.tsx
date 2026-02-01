import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// sample data
const data = [
  { month: "Jan", score: 6.5 },
  { month: "Feb", score: 7.0 },
  { month: "Mar", score: 7.2 },
  { month: "Apr", score: 7.5 },
  { month: "May", score: 7.8 },
  { month: "Jun", score: 8.0 },
  { month: "Aug", score: 8.2 },
  { month: "Oct", score: 8.0 },
  { month: "Nov", score: 8.2 },
  { month: "Dec", score: 7.8 },
];

export function FormScoreProgressChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
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
          dataKey="month"
          stroke="rgb(var(--subheading))"
          style={{ fontSize: "12px" }}
          tick={{ fill: "rgb(var(--subheading))" }}
        />
        <YAxis
          domain={[6, 9]}
          ticks={[6.0, 6.5, 7.0, 7.5, 8.0, 8.5]}
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
          formatter={(value?: number) => [
            <span style={{ color: "rgb(var(--secondary))" }}>
              Score: {value?.toFixed(1)}
            </span>,
          ]}
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
