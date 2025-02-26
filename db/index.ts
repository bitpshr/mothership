import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const isMemory = !process.env.DATABASE_URL && process.env.NODE_ENV === "production";

const client = createClient({
  url: process.env.DATABASE_URL ?? (isMemory ? ":memory:" : "file:mothership.db"),
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const _db = drizzle(client, { schema });

let _ready: Promise<void> | null = null;

async function seedMemoryDb() {
  const { PROPERTIES, UNITS, TENANTS, MAINTENANCE } = await import("./seed-data");

  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS properties (
      id text PRIMARY KEY NOT NULL,
      name text NOT NULL,
      type text NOT NULL,
      street text NOT NULL,
      city text NOT NULL,
      state text NOT NULL,
      zip text NOT NULL,
      unit_count integer NOT NULL,
      year_built integer NOT NULL,
      image_url text,
      created_at text NOT NULL
    );
    CREATE TABLE IF NOT EXISTS units (
      id text PRIMARY KEY NOT NULL,
      property_id text NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      unit_number text NOT NULL,
      status text NOT NULL,
      bedrooms integer NOT NULL,
      bathrooms real NOT NULL,
      square_feet integer NOT NULL,
      monthly_rent integer NOT NULL,
      tenant_id text
    );
    CREATE TABLE IF NOT EXISTS tenants (
      id text PRIMARY KEY NOT NULL,
      unit_id text NOT NULL REFERENCES units(id),
      property_id text NOT NULL REFERENCES properties(id),
      first_name text NOT NULL,
      last_name text NOT NULL,
      email text NOT NULL,
      phone text NOT NULL,
      lease_start text NOT NULL,
      lease_end text NOT NULL,
      monthly_rent integer NOT NULL,
      security_deposit integer NOT NULL,
      created_at text NOT NULL
    );
    CREATE TABLE IF NOT EXISTS maintenance_requests (
      id text PRIMARY KEY NOT NULL,
      property_id text NOT NULL REFERENCES properties(id),
      unit_id text NOT NULL REFERENCES units(id),
      tenant_id text NOT NULL REFERENCES tenants(id),
      title text NOT NULL,
      description text NOT NULL,
      priority text NOT NULL,
      status text NOT NULL DEFAULT 'open',
      notes text,
      created_at text NOT NULL,
      updated_at text NOT NULL,
      resolved_at text
    );
  `);

  await _db.insert(schema.properties).values(PROPERTIES);
  await _db.insert(schema.units).values(UNITS);
  await _db.insert(schema.tenants).values(TENANTS);
  await _db.insert(schema.maintenanceRequests).values(MAINTENANCE);
}

export async function getDb() {
  if (isMemory && !_ready) {
    _ready = seedMemoryDb();
  }
  if (_ready) await _ready;
  return _db;
}
