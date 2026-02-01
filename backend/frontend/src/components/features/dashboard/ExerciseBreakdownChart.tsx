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

// sample data
const data = [
  { exercise: "Squat", count: 12 },
  { exercise: "Push Up", count: 18 },
  { exercise: "Bench Press", count: 15 },
  { exercise: "Deadlift", count: 22 },
];

// color palette for bars
const colors = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b"];

export function ExerciseBreakdownChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="rgb(var(--subtle))"
          opacity={0.3}
        />
        <XAxis
          dataKey="exercise"
          stroke="rgb(var(--subheading))"
          style={{ fontSize: "12px" }}
          tick={{ fill: "rgb(var(--subheading))" }}
        />
        <YAxis
          stroke="rgb(var(--subheading))"
          style={{ fontSize: "12px" }}
          tick={{ fill: "rgb(var(--subheading))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgb(var(--card-primary))",
            border: "1px solid rgb(var(--subtle))",
            borderRadius: "8px",
          }}
          formatter={(value?: number) => [
            <span style={{ color: "rgb(var(--secondary))" }}>
              Count: {value}
            </span>,
          ]}
          labelStyle={{ color: "rgb(var(--subheading))" }}
          cursor={{ fill: "#976e4c1a" }}
        />
        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
