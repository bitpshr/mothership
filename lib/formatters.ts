import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import type { LeaseStatus } from "@/db/schema";

/** Converts integer cents to a formatted USD string: 220000 → "$2,200.00" */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Formats an ISO 8601 date string to a human-readable date: "Jan 15, 2026" */
export function formatDate(isoString: string): string {
  return format(new Date(isoString), "MMM d, yyyy");
}

/** Returns a relative time string: "3 days ago", "in 2 months" */
export function formatRelativeTime(isoString: string): string {
  return formatDistanceToNow(new Date(isoString), { addSuffix: true });
}

/** Converts a 0–1 float occupancy rate to a percentage string: 0.75 → "75%" */
export function formatOccupancy(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

/**
 * Derives lease status from the lease end date string.
 * - expired:       end date is in the past
 * - expiring_soon: ends within 60 days
 * - active:        ends more than 60 days from now
 */
export function computeLeaseStatus(leaseEnd: string): LeaseStatus {
  const daysUntilExpiry = differenceInDays(new Date(leaseEnd), new Date());

  if (daysUntilExpiry < 0) return "expired";
  if (daysUntilExpiry <= 60) return "expiring_soon";
  return "active";
}
