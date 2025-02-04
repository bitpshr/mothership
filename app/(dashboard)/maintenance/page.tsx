import type { Metadata } from "next";
import { AlertOctagon, CheckCheck, Loader2, XCircle } from "lucide-react";
import { getMaintenanceRequests } from "@/db/queries/maintenance";
import { getProperties } from "@/db/queries/properties";
import { getOccupiedUnits } from "@/db/queries/units";
import { getTenants } from "@/db/queries/tenants";
import { RequestsTable } from "@/components/maintenance/RequestsTable";
import { AddMaintenanceModal } from "@/components/maintenance/AddMaintenanceModal";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "MAINTENANCE" };

export default async function MaintenancePage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>;
}) {
  const { request: initialRequestId } = await searchParams;
  const [requests, properties, occupiedUnits, tenants] = await Promise.all([
    getMaintenanceRequests(),
    getProperties(),
    getOccupiedUnits(),
    getTenants(),
  ]);

  const openCount = requests.filter((r) => r.status === "open").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const resolvedCount = requests.filter((r) => r.status === "resolved").length;
  const emergencyCount = requests.filter(
    (r) => r.priority === "emergency" && (r.status === "open" || r.status === "in_progress"),
  ).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Maintenance</h1>
          <p className="text-sm text-muted-foreground">
            {openCount + inProgressCount} open{" "}
            {openCount + inProgressCount === 1 ? "request" : "requests"} across all properties
          </p>
          {requests.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {emergencyCount > 0 && (
                <Badge className="border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400">
                  <AlertOctagon />{emergencyCount} emergency
                </Badge>
              )}
              {openCount > 0 && (
                <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                  <XCircle />{openCount} open
                </Badge>
              )}
              {inProgressCount > 0 && (
                <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  <Loader2 />{inProgressCount} in progress
                </Badge>
              )}
              {resolvedCount > 0 && (
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <CheckCheck />{resolvedCount} resolved
                </Badge>
              )}
            </div>
          )}
        </div>
        <AddMaintenanceModal
          properties={properties}
          occupiedUnits={occupiedUnits}
          tenants={tenants}
        />
      </div>
      <RequestsTable requests={requests} initialRequestId={initialRequestId} />
    </div>
  );
}
