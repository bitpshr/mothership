import type { MaintenanceRequest } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_LABELS } from "@/lib/constants";

const PRIORITY_COLORS: Record<MaintenanceRequest["priority"], string> = {
  low: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
  high: "border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-800 dark:bg-orange-900/40 dark:text-orange-400",
  emergency: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400",
};

type PriorityBadgeProps = {
  priority: MaintenanceRequest["priority"];
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return <Badge className={PRIORITY_COLORS[priority]}>{PRIORITY_LABELS[priority]}</Badge>;
}
