import type { MaintenanceRequest } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS } from "@/lib/constants";

const STATUS_COLORS: Record<MaintenanceRequest["status"], string> = {
  open: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400",
  in_progress: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  resolved: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
  closed: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

type StatusBadgeProps = {
  status: MaintenanceRequest["status"];
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge className={STATUS_COLORS[status]}>{STATUS_LABELS[status]}</Badge>;
}
