/**
 * Seed script — run once to populate the database with realistic demo data.
 * Usage: bun db/seed.ts
 *
 * Idempotent: clears all tables before inserting.
 */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { maintenanceRequests, properties, tenants, units } from "./schema";
import { PROPERTIES, UNITS, TENANTS, MAINTENANCE } from "./seed-data";

const client = createClient({ url: "file:./mothership.db" });
const db = drizzle(client);

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear in reverse dependency order
  await db.delete(maintenanceRequests);
  await db.delete(tenants);
  await db.delete(units);
  await db.delete(properties);

  await db.insert(properties).values(PROPERTIES);
  console.log(`  ✓ ${PROPERTIES.length} properties`);

  await db.insert(units).values(UNITS);
  console.log(`  ✓ ${UNITS.length} units`);

  await db.insert(tenants).values(TENANTS);
  console.log(`  ✓ ${TENANTS.length} tenants`);

  await db.insert(maintenanceRequests).values(MAINTENANCE);
  console.log(`  ✓ ${MAINTENANCE.length} maintenance requests`);

  console.log("✅ Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
