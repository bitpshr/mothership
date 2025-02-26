"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { maintenanceRequests } from "@/db/schema";
import type { MaintenanceRequest } from "@/db/schema";
import { maintenanceRequestSchema, type MaintenanceRequestFormValues } from "@/lib/schemas";

export async function createMaintenanceRequest(values: MaintenanceRequestFormValues) {
  const db = await getDb();
  const validated = maintenanceRequestSchema.parse(values);
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await db.insert(maintenanceRequests).values({
    id,
    ...validated,
    status: "open",
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
  });

  revalidatePath("/maintenance");
  revalidatePath(`/properties/${validated.propertyId}`);
  return { id };
}

export async function updateRequestStatus(
  id: string,
  status: MaintenanceRequest["status"],
) {
  const db = await getDb();
  const now = new Date().toISOString();

  await db
    .update(maintenanceRequests)
    .set({
      status,
      updatedAt: now,
      resolvedAt: status === "resolved" ? now : null,
    })
    .where(eq(maintenanceRequests.id, id));

  revalidatePath("/maintenance");
  revalidatePath("/");
}

export async function updateRequestNotes(id: string, notes: string) {
  const db = await getDb();
  const now = new Date().toISOString();

  await db
    .update(maintenanceRequests)
    .set({ notes, updatedAt: now })
    .where(eq(maintenanceRequests.id, id));

  revalidatePath("/maintenance");
}

export async function deleteMaintenanceRequest(id: string) {
  const db = await getDb();
  const request = await db
    .select()
    .from(maintenanceRequests)
    .where(eq(maintenanceRequests.id, id))
    .get();

  await db.delete(maintenanceRequests).where(eq(maintenanceRequests.id, id));

  revalidatePath("/maintenance");
  revalidatePath("/");
  if (request) revalidatePath(`/properties/${request.propertyId}`);
}
