import { Badge } from "@/components/ui/badge";
import { formatOccupancy } from "@/lib/formatters";

type OccupancyBadgeProps = {
  rate: number;
};

export function OccupancyBadge({ rate }: OccupancyBadgeProps) {
  const colorClass =
    rate >= 0.9
      ? "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400"
      : rate >= 0.7
        ? "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400"
        : "border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-400";

  return <Badge className={colorClass}>{formatOccupancy(rate)}</Badge>;
}
