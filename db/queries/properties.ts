import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { properties, units } from "@/db/schema";
import type { Property, PropertySummary } from "@/db/schema";

export async function getProperties(): Promise<Property[]> {
  const db = await getDb();
  return db.select().from(properties).orderBy(properties.createdAt);
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  const db = await getDb();
  const rows = await db.select().from(properties).where(eq(properties.id, id));
  return rows[0];
}

/**
 * Returns each property with occupancy and revenue computed from its units.
 * Requires one extra query per property — acceptable for a small portfolio.
 */
export async function getPropertySummaries(): Promise<PropertySummary[]> {
  const db = await getDb();
  const allProperties = await getProperties();
  const allUnits = await db.select().from(units);

  return allProperties.map((property) => {
    const propertyUnits = allUnits.filter((u) => u.propertyId === property.id);
    const occupiedUnits = propertyUnits.filter((u) => u.status === "occupied");
    const vacantUnits = propertyUnits.filter((u) => u.status === "vacant");
    const monthlyRevenue = occupiedUnits.reduce((sum, u) => sum + u.monthlyRent, 0);

    return {
      ...property,
      occupancyRate: propertyUnits.length > 0 ? occupiedUnits.length / propertyUnits.length : 0,
      occupiedUnits: occupiedUnits.length,
      vacantUnits: vacantUnits.length,
      monthlyRevenue,
    };
  });
}
