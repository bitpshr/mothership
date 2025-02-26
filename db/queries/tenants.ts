import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { properties, tenants, units } from "@/db/schema";
import type { TenantWithLeaseStatus } from "@/db/schema";
import { computeLeaseStatus } from "@/lib/formatters";

export async function getTenants(): Promise<TenantWithLeaseStatus[]> {
  const db = await getDb();
  const rows = await db
    .select({
      tenant: tenants,
      propertyName: properties.name,
      unitNumber: units.unitNumber,
    })
    .from(tenants)
    .innerJoin(properties, eq(tenants.propertyId, properties.id))
    .innerJoin(units, eq(tenants.unitId, units.id))
    .orderBy(tenants.lastName);

  return rows.map(({ tenant, propertyName, unitNumber }) => ({
    ...tenant,
    leaseStatus: computeLeaseStatus(tenant.leaseEnd),
    propertyName,
    unitNumber,
  }));
}

export async function getTenantsByPropertyId(propertyId: string): Promise<TenantWithLeaseStatus[]> {
  const db = await getDb();
  const rows = await db
    .select({
      tenant: tenants,
      propertyName: properties.name,
      unitNumber: units.unitNumber,
    })
    .from(tenants)
    .innerJoin(properties, eq(tenants.propertyId, properties.id))
    .innerJoin(units, eq(tenants.unitId, units.id))
    .where(eq(tenants.propertyId, propertyId))
    .orderBy(tenants.lastName);

  return rows.map(({ tenant, propertyName, unitNumber }) => ({
    ...tenant,
    leaseStatus: computeLeaseStatus(tenant.leaseEnd),
    propertyName,
    unitNumber,
  }));
}
