import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { maintenanceRequests, properties, tenants, units } from "@/db/schema";
import type { MaintenanceRequest } from "@/db/schema";

export type MaintenanceRequestWithContext = MaintenanceRequest & {
  propertyName: string;
  unitNumber: string;
  tenantName: string;
};

export async function getMaintenanceRequests(): Promise<MaintenanceRequestWithContext[]> {
  const db = await getDb();
  const rows = await db
    .select({
      request: maintenanceRequests,
      propertyName: properties.name,
      unitNumber: units.unitNumber,
      tenantFirstName: tenants.firstName,
      tenantLastName: tenants.lastName,
    })
    .from(maintenanceRequests)
    .innerJoin(properties, eq(maintenanceRequests.propertyId, properties.id))
    .innerJoin(units, eq(maintenanceRequests.unitId, units.id))
    .innerJoin(tenants, eq(maintenanceRequests.tenantId, tenants.id))
    .orderBy(desc(maintenanceRequests.createdAt));

  return rows.map(({ request, propertyName, unitNumber, tenantFirstName, tenantLastName }) => ({
    ...request,
    propertyName,
    unitNumber,
    tenantName: `${tenantFirstName} ${tenantLastName}`,
  }));
}

export async function getMaintenanceByPropertyId(
  propertyId: string,
): Promise<MaintenanceRequestWithContext[]> {
  const db = await getDb();
  const rows = await db
    .select({
      request: maintenanceRequests,
      propertyName: properties.name,
      unitNumber: units.unitNumber,
      tenantFirstName: tenants.firstName,
      tenantLastName: tenants.lastName,
    })
    .from(maintenanceRequests)
    .innerJoin(properties, eq(maintenanceRequests.propertyId, properties.id))
    .innerJoin(units, eq(maintenanceRequests.unitId, units.id))
    .innerJoin(tenants, eq(maintenanceRequests.tenantId, tenants.id))
    .where(eq(maintenanceRequests.propertyId, propertyId))
    .orderBy(desc(maintenanceRequests.createdAt));

  return rows.map(({ request, propertyName, unitNumber, tenantFirstName, tenantLastName }) => ({
    ...request,
    propertyName,
    unitNumber,
    tenantName: `${tenantFirstName} ${tenantLastName}`,
  }));
}
