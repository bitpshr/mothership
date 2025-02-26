"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { tenants, units } from "@/db/schema";
import { tenantSchema, updateTenantSchema, type TenantFormValues, type UpdateTenantFormValues } from "@/lib/schemas";

export async function createTenant(values: TenantFormValues) {
  const db = await getDb();
  const validated = tenantSchema.parse(values);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(tenants).values({
    id,
    firstName: validated.firstName,
    lastName: validated.lastName,
    email: validated.email,
    phone: validated.phone,
    propertyId: validated.propertyId,
    unitId: validated.unitId,
    leaseStart: validated.leaseStart,
    leaseEnd: validated.leaseEnd,
    // Form collects dollars; DB stores cents
    monthlyRent: validated.monthlyRent * 100,
    securityDeposit: validated.securityDeposit * 100,
    createdAt: now,
  });

  // Mark the unit as occupied
  await db
    .update(units)
    .set({ status: "occupied", tenantId: id })
    .where(eq(units.id, validated.unitId));

  revalidatePath("/tenants");
  revalidatePath("/properties");
  revalidatePath("/");
  return { id };
}

export async function updateTenant(id: string, values: UpdateTenantFormValues) {
  const db = await getDb();
  const validated = updateTenantSchema.parse(values);

  await db
    .update(tenants)
    .set({
      firstName: validated.firstName,
      lastName: validated.lastName,
      email: validated.email,
      phone: validated.phone,
      leaseStart: validated.leaseStart,
      leaseEnd: validated.leaseEnd,
      monthlyRent: validated.monthlyRent * 100,
      securityDeposit: validated.securityDeposit * 100,
    })
    .where(eq(tenants.id, id));

  revalidatePath("/tenants");
  revalidatePath("/properties");
  revalidatePath("/");
}

export async function deleteTenant(id: string) {
  const db = await getDb();
  // Find the tenant's unit before deleting
  const tenant = await db.select().from(tenants).where(eq(tenants.id, id)).get();

  await db.delete(tenants).where(eq(tenants.id, id));

  if (tenant) {
    // Free up the unit
    await db
      .update(units)
      .set({ status: "vacant", tenantId: null })
      .where(eq(units.id, tenant.unitId));
  }

  revalidatePath("/tenants");
  revalidatePath("/properties");
  revalidatePath("/");
}
