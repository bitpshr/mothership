import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";

type Color = "blue" | "emerald" | "violet" | "amber" | "rose";

const COLOR_MAP: Record<
  Color,
  { gradient: string; icon: string; value: string; border: string }
> = {
  blue: {
    gradient: "from-blue-500/12 via-transparent to-transparent dark:from-blue-500/18",
    icon: "text-blue-600 dark:text-blue-400",
    value: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200/70 dark:border-blue-500/25",
  },
  emerald: {
    gradient: "from-emerald-500/12 via-transparent to-transparent dark:from-emerald-500/18",
    icon: "text-emerald-600 dark:text-emerald-400",
    value: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200/70 dark:border-emerald-500/25",
  },
  violet: {
    gradient: "from-violet-500/12 via-transparent to-transparent dark:from-violet-500/18",
    icon: "text-violet-600 dark:text-violet-400",
    value: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200/70 dark:border-violet-500/25",
  },
  amber: {
    gradient: "from-amber-500/12 via-transparent to-transparent dark:from-amber-500/18",
    icon: "text-amber-600 dark:text-amber-400",
    value: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200/70 dark:border-amber-500/25",
  },
  rose: {
    gradient: "from-rose-500/12 via-transparent to-transparent dark:from-rose-500/18",
    icon: "text-rose-600 dark:text-rose-400",
    value: "text-rose-700 dark:text-rose-300",
    border: "border-rose-200/70 dark:border-rose-500/25",
  },
};

type StatCardProps = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  format?: "currency" | "number" | "string";
  description?: string;
  color?: Color;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  format = "number",
  description,
  color,
}: StatCardProps) {
  const displayValue =
    format === "currency" && typeof value === "number" ? formatCurrency(value) : String(value);

  const colors = color ? COLOR_MAP[color] : null;

  return (
    <Card
      className={cn(
        "relative overflow-hidden",
        colors && `bg-gradient-to-br ${colors.gradient} ${colors.border}`,
      )}
    >
      <CardContent className="px-5">
        {colors ? (
          <Icon className={cn("h-7 w-7", colors.icon)} />
        ) : (
          <Icon className="h-7 w-7 text-muted-foreground" />
        )}
        <p className="mt-3 text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-2xl font-bold tracking-tight", colors?.value)}>
          {displayValue}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
