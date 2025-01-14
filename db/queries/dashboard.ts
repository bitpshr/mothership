import { db } from "@/db";
import { maintenanceRequests, properties, tenants, units } from "@/db/schema";
import type { ActivityItem, DashboardStats, MonthlyRevenueDatum, UnitStatusBreakdown } from "@/db/schema";
import { format, subMonths } from "date-fns";

export async function getDashboardStats(): Promise<DashboardStats> {
  const [allProperties, allUnits, openRequests] = await Promise.all([
    db.select().from(properties),
    db.select().from(units),
    db.select().from(maintenanceRequests),
  ]);

  const occupiedUnits = allUnits.filter((u) => u.status === "occupied");
  const monthlyRevenue = occupiedUnits.reduce((sum, u) => sum + u.monthlyRent, 0);
  const openCount = openRequests.filter((r) => r.status === "open" || r.status === "in_progress").length;

  return {
    totalProperties: allProperties.length,
    totalUnits: allUnits.length,
    occupiedUnits: occupiedUnits.length,
    occupancyRate: allUnits.length > 0 ? occupiedUnits.length / allUnits.length : 0,
    monthlyRevenue,
    openMaintenanceRequests: openCount,
  };
}

/**
 * Generates a 12-month revenue series for the area chart.
 * Uses the current month's actual revenue and simulates a realistic growth
 * curve for prior months — appropriate for a portfolio demo.
 */
export async function getMonthlyRevenueSeries(): Promise<MonthlyRevenueDatum[]> {
  const allUnits = await db.select().from(units);
  const currentRevenue = allUnits
    .filter((u) => u.status === "occupied")
    .reduce((sum, u) => sum + u.monthlyRent, 0);

  return Array.from({ length: 12 }, (_, i) => {
    const monthOffset = 11 - i;
    const date = subMonths(new Date(), monthOffset);
    // Simulate 5–15% growth over 12 months with slight variance
    const growthFactor = 0.85 + (i / 11) * 0.15 + (Math.sin(i) * 0.02);
    const revenue = Math.round(currentRevenue * growthFactor);
    const expenses = Math.round(revenue * (0.3 + Math.sin(i * 0.7) * 0.05));

    return {
      month: format(date, "MMM"),
      revenue,
      expenses,
    };
  });
}

export async function getUnitStatusBreakdown(): Promise<UnitStatusBreakdown> {
  const allUnits = await db.select().from(units);
  return {
    occupied: allUnits.filter((u) => u.status === "occupied").length,
    vacant: allUnits.filter((u) => u.status === "vacant").length,
    maintenance: allUnits.filter((u) => u.status === "maintenance").length,
  };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const [recentMaintenance, allProperties, allTenants] = await Promise.all([
    db.select().from(maintenanceRequests).orderBy(maintenanceRequests.createdAt),
    db.select().from(properties),
    db.select().from(tenants).orderBy(tenants.createdAt),
  ]);

  const propertyMap = Object.fromEntries(allProperties.map((p) => [p.id, p.name]));

  const maintenanceItems: ActivityItem[] = recentMaintenance.slice(-5).map((r) => ({
    id: r.id,
    type: "maintenance_opened" as const,
    description: `New ${r.priority} priority request: "${r.title}"`,
    propertyName: propertyMap[r.propertyId] ?? "Unknown",
    timestamp: r.createdAt,
    href: `/maintenance?request=${r.id}`,
  }));

  const leaseItems: ActivityItem[] = allTenants.slice(-5).map((t) => ({
    id: `lease_${t.id}`,
    type: "lease_signed" as const,
    description: `${t.firstName} ${t.lastName} signed a lease`,
    propertyName: propertyMap[t.propertyId] ?? "Unknown",
    timestamp: t.createdAt,
    href: `/tenants?tenant=${t.id}`,
  }));

  return [...maintenanceItems, ...leaseItems]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8);
}
