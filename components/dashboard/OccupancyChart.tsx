"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UnitStatusBreakdown } from "@/db/schema";

type OccupancyChartProps = {
  data: UnitStatusBreakdown;
  className?: string;
};

const SEGMENTS = [
  { key: "occupied" as const, label: "Occupied", color: "#10b981" },
  { key: "vacant" as const, label: "Vacant", color: "#6366f1" },
  { key: "maintenance" as const, label: "Maintenance", color: "#f59e0b" },
];

export function OccupancyChart({ data, className }: OccupancyChartProps) {
  const total = data.occupied + data.vacant + data.maintenance;
  const rate = total > 0 ? Math.round((data.occupied / total) * 100) : 0;

  const chartData = SEGMENTS.map((s) => ({
    name: s.label,
    value: data[s.key],
    color: s.color,
  }));

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Unit Occupancy</CardTitle>
        <p className="text-xs text-muted-foreground">{total} total units across portfolio</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-0">
        <div className="relative h-[180px] w-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: -10, right: 0, bottom: -10, left: 0 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold tracking-tight">{rate}%</span>
            <span className="text-[11px] text-muted-foreground">Occupied</span>
          </div>
        </div>

        <div className="flex justify-center gap-5 mt-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}
              </div>
              <span className="text-lg font-semibold tabular-nums">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
