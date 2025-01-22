import type { Metadata } from "next";
import { Building2, DollarSign, TrendingUp, Wrench } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import {
  getDashboardStats,
  getMonthlyRevenueSeries,
  getUnitStatusBreakdown,
  getRecentActivity,
} from "@/db/queries/dashboard";
import { getProperties } from "@/db/queries/properties";
import { getVacantUnits, getOccupiedUnits } from "@/db/queries/units";
import { getTenants } from "@/db/queries/tenants";
import { formatOccupancy } from "@/lib/formatters";

export const metadata: Metadata = { title: "DASHBOARD" };

export default async function DashboardPage() {
  const [stats, revenueSeries, unitBreakdown, activity, properties, vacantUnits, occupiedUnits, tenants] =
    await Promise.all([
      getDashboardStats(),
      getMonthlyRevenueSeries(),
      getUnitStatusBreakdown(),
      getRecentActivity(),
      getProperties(),
      getVacantUnits(),
      getOccupiedUnits(),
      getTenants(),
    ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Your portfolio at a glance.</p>
        </div>
        <QuickActions
          properties={properties}
          vacantUnits={vacantUnits}
          occupiedUnits={occupiedUnits}
          tenants={tenants}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Total Properties"
            value={stats.totalProperties}
            icon={Building2}
            color="blue"
            description={`${stats.totalUnits} units across all properties`}
          />
          <StatCard
            label="Occupancy Rate"
            value={formatOccupancy(stats.occupancyRate)}
            icon={TrendingUp}
            format="string"
            color="emerald"
            description={`${stats.occupiedUnits} of ${stats.totalUnits} units occupied`}
          />
          <StatCard
            label="Monthly Revenue"
            value={stats.monthlyRevenue}
            icon={DollarSign}
            format="currency"
            color="violet"
            description="From occupied units"
          />
          <StatCard
            label="Open Requests"
            value={stats.openMaintenanceRequests}
            icon={Wrench}
            color="amber"
            description="Maintenance requests needing attention"
          />
        </div>
        <OccupancyChart data={unitBreakdown} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <RevenueChart data={revenueSeries} className="lg:col-span-2" />
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
}
