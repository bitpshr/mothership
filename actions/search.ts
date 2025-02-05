"use server";

import { like, or } from "drizzle-orm";
import { db } from "@/db";
import { properties, tenants, maintenanceRequests } from "@/db/schema";

export type SearchResult = {
  type: "property" | "tenant" | "maintenance";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const q = `%${query.trim()}%`;

  const [propResults, tenantResults, mainResults] = await Promise.all([
    db
      .select({ id: properties.id, name: properties.name, city: properties.city, state: properties.state })
      .from(properties)
      .where(or(like(properties.name, q), like(properties.city, q), like(properties.street, q)))
      .limit(4),
    db
      .select({ id: tenants.id, firstName: tenants.firstName, lastName: tenants.lastName, email: tenants.email })
      .from(tenants)
      .where(or(like(tenants.firstName, q), like(tenants.lastName, q), like(tenants.email, q)))
      .limit(4),
    db
      .select({ id: maintenanceRequests.id, title: maintenanceRequests.title, priority: maintenanceRequests.priority, status: maintenanceRequests.status })
      .from(maintenanceRequests)
      .where(or(like(maintenanceRequests.title, q), like(maintenanceRequests.description, q)))
      .limit(4),
  ]);

  return [
    ...propResults.map((p) => ({
      type: "property" as const,
      id: p.id,
      title: p.name,
      subtitle: `${p.city}, ${p.state}`,
      href: `/properties/${p.id}`,
    })),
    ...tenantResults.map((t) => ({
      type: "tenant" as const,
      id: t.id,
      title: `${t.firstName} ${t.lastName}`,
      subtitle: t.email,
      href: `/tenants?tenant=${t.id}`,
    })),
    ...mainResults.map((r) => ({
      type: "maintenance" as const,
      id: r.id,
      title: r.title,
      subtitle: `${r.priority} · ${r.status}`,
      href: `/maintenance?request=${r.id}`,
    })),
  ];
}
