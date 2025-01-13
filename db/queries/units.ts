import { eq } from "drizzle-orm";
import { db } from "@/db";
import { units } from "@/db/schema";
import type { Unit } from "@/db/schema";

export async function getUnitsByPropertyId(propertyId: string): Promise<Unit[]> {
  return db
    .select()
    .from(units)
    .where(eq(units.propertyId, propertyId))
    .orderBy(units.unitNumber);
}

export async function getVacantUnits(): Promise<Unit[]> {
  return db.select().from(units).where(eq(units.status, "vacant")).orderBy(units.unitNumber);
}

export async function getOccupiedUnits(): Promise<Unit[]> {
  return db.select().from(units).where(eq(units.status, "occupied")).orderBy(units.unitNumber);
}
