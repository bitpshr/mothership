"use client";

import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyRevenueDatum } from "@/db/schema";
import { formatCurrency } from "@/lib/formatters";

type RevenueChartProps = {
  data: MonthlyRevenueDatum[];
  className?: string;
};

function barColor(index: number, total: number): string {
  const t = index / Math.max(total - 1, 1);
  const hue = Math.round(175 + t * 105);
  return `hsl(${hue}, 65%, ${52 - t * 2}%)`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string; fill?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const revenue = payload.find((p) => p.name === "revenue")?.value ?? 0;
  const expenses = payload.find((p) => p.name === "expenses")?.value ?? 0;
  const net = revenue - expenses;

  return (
    <div className="rounded-xl border bg-popover/95 backdrop-blur-sm px-4 py-3 shadow-xl text-sm min-w-[180px]">
      <p className="font-semibold mb-2 text-foreground">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-chart-1 shrink-0" />
            <span className="text-muted-foreground">Revenue</span>
          </div>
          <span className="font-medium tabular-nums">{formatCurrency(revenue)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border-2 border-chart-2 shrink-0" />
            <span className="text-muted-foreground">Expenses</span>
          </div>
          <span className="font-medium tabular-nums">{formatCurrency(expenses)}</span>
        </div>
        <div className="border-t pt-1.5 mt-1.5 flex items-center justify-between gap-4">
          <span className="text-muted-foreground font-medium">Net</span>
          <span
            className={`font-bold tabular-nums ${
              net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
            }`}
          >
            {net >= 0 ? "+" : ""}
            {formatCurrency(net)}
          </span>
        </div>
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "indigo" | "teal" | "green" | "red";
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400",
    teal: "bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
    green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
    red: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  };
  return (
    <div className={`rounded-lg px-3 py-1.5 text-center ${colors[color]}`}>
      <p className="text-[10px] font-medium uppercase tracking-wide opacity-75">{label}</p>
      <p className="text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

export function RevenueChart({ data, className }: RevenueChartProps) {
  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expenses, 0);
  const netIncome = totalRevenue - totalExpenses;
  const avgRevenue = totalRevenue / (data.length || 1);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Revenue vs. Expenses</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Last 12 months &middot; all properties</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <SummaryPill label="Revenue" value={formatCurrency(totalRevenue)} color="indigo" />
            <SummaryPill label="Expenses" value={formatCurrency(totalExpenses)} color="teal" />
            <SummaryPill
              label="Net income"
              value={formatCurrency(netIncome)}
              color={netIncome >= 0 ? "green" : "red"}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: -12, bottom: 0 }} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.5}
              vertical={false}
            />

            <ReferenceLine
              y={avgRevenue}
              stroke="var(--chart-1)"
              strokeDasharray="6 3"
              strokeOpacity={0.4}
              strokeWidth={1}
              label={{
                value: "avg",
                position: "insideTopRight",
                fontSize: 10,
                fill: "var(--muted-foreground)",
                dy: -4,
              }}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              dy={6}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 100000).toFixed(0)}k`}
              width={40}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", fillOpacity: 0.5, radius: 6 }} />

            <Bar dataKey="revenue" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {data.map((_, i) => (
                <Cell key={i} fill={barColor(i, data.length)} />
              ))}
            </Bar>

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="var(--chart-2)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--chart-2)", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "var(--chart-2)", strokeWidth: 2, stroke: "var(--background)" }}
              strokeDasharray="0"
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-8 rounded-sm"
              style={{ background: "linear-gradient(to right, hsl(175, 65%, 52%), hsl(280, 65%, 50%))" }}
            />
            Revenue
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 bg-chart-2" />
            <span className="size-2 rounded-full bg-chart-2" />
            Expenses
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-px w-5 border-t border-dashed border-chart-1 opacity-50" />
            Avg. revenue
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
