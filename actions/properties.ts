"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { properties } from "@/db/schema";
import { propertySchema, type PropertyFormValues } from "@/lib/schemas";

export async function createProperty(values: PropertyFormValues) {
  const validated = propertySchema.parse(values);
  const id = crypto.randomUUID();

  await db.insert(properties).values({
    id,
    ...validated,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/properties");
  return { id };
}

export async function updateProperty(id: string, values: Partial<PropertyFormValues>) {
  const validated = propertySchema.partial().parse(values);

  await db.update(properties).set(validated).where(eq(properties.id, id));

  revalidatePath("/properties");
  revalidatePath(`/properties/${id}`);
}

export async function deleteProperty(id: string) {
  await db.delete(properties).where(eq(properties.id, id));
  revalidatePath("/properties");
}
