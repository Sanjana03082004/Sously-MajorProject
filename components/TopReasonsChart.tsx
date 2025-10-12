"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TopReasonsChartProps {
  moods: {
    mood: string;
    reason: string;
  }[];
}

export function TopReasonsChart({ moods }: TopReasonsChartProps) {
  if (!moods || moods.length === 0) {
    return (
      <Card className="border-pink-200 bg-white/80 shadow-md text-center py-8">
        <p className="text-gray-500">No data to display yet.</p>
      </Card>
    );
  }

  // Group by reason
  const counts: Record<string, number> = {};
  moods.forEach((m) => {
    const reason = m.reason?.trim() || "Unspecified";
    counts[reason] = (counts[reason] || 0) + 1;
  });

  const data = Object.entries(counts)
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const colors = ["#f9a8d4", "#fca5a5", "#c084fc", "#93c5fd", "#86efac", "#fcd34d"];

  return (
    <Card className="border-pink-200 bg-white/90 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-pink-700">💭 Most Frequent Reasons</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#fbcfe8" />
            <XAxis
              dataKey="reason"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip cursor={{ fill: "rgba(0,0,0,0.05)" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
