import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2, Clock, DollarSign, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTenants } from "@/db/queries/tenants";
import { getProperties } from "@/db/queries/properties";
import { getVacantUnits } from "@/db/queries/units";
import { TenantsTable } from "@/components/tenants/TenantsTable";
import { AddTenantModal } from "@/components/tenants/AddTenantModal";
import { StatCard } from "@/components/dashboard/StatCard";
import { computeLeaseStatus } from "@/lib/formatters";

export const metadata: Metadata = { title: "TENANTS" };

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: Promise<{ tenant?: string }>;
}) {
  const { tenant: initialTenantId } = await searchParams;
  const [tenants, properties, vacantUnits] = await Promise.all([
    getTenants(),
    getProperties(),
    getVacantUnits(),
  ]);

  let activeCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;
  let totalMonthlyRent = 0;
  for (const t of tenants) {
    const status = computeLeaseStatus(t.leaseEnd);
    if (status === "active") activeCount++;
    else if (status === "expiring_soon") expiringSoonCount++;
    else if (status === "expired") expiredCount++;
    totalMonthlyRent += t.monthlyRent;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tenants</h1>
          <p className="text-sm text-muted-foreground">
            {tenants.length} active {tenants.length === 1 ? "tenant" : "tenants"} across all
            properties
          </p>
          {tenants.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                <CheckCircle2 />{activeCount} active leases
              </Badge>
              {expiringSoonCount > 0 && (
                <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  <Clock />{expiringSoonCount} expiring soon
                </Badge>
              )}
              {expiredCount > 0 && (
                <Badge className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
                  <AlertTriangle />{expiredCount} expired
                </Badge>
              )}
            </div>
          )}
        </div>
        <AddTenantModal properties={properties} vacantUnits={vacantUnits} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tenants"
          value={tenants.length}
          icon={Users}
          color="blue"
          description="Active in your portfolio"
        />
        <StatCard
          label="Active Leases"
          value={activeCount}
          icon={CheckCircle2}
          color="emerald"
          description="Current valid leases"
        />
        <StatCard
          label="Expiring Soon"
          value={expiringSoonCount}
          icon={Clock}
          color="amber"
          description="Within the next 60 days"
        />
        <StatCard
          label="Monthly Revenue"
          value={totalMonthlyRent}
          icon={DollarSign}
          format="currency"
          color="violet"
          description="Total rent collected"
        />
      </div>

      <TenantsTable tenants={tenants} initialTenantId={initialTenantId} />
    </div>
  );
}
