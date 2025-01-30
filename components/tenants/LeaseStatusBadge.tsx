import type { LeaseStatus } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import { LEASE_STATUS_LABELS } from "@/lib/constants";

const LEASE_STATUS_COLORS: Record<LeaseStatus, string> = {
  active: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
  expiring_soon: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
  expired: "border-red-200 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/40 dark:text-red-400",
  pending: "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
};

type LeaseStatusBadgeProps = {
  status: LeaseStatus;
};

export function LeaseStatusBadge({ status }: LeaseStatusBadgeProps) {
  return <Badge className={LEASE_STATUS_COLORS[status]}>{LEASE_STATUS_LABELS[status]}</Badge>;
}
