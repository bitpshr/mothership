import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type", { enum: ["apartment", "house", "condo", "commercial"] }).notNull(),
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zip: text("zip").notNull(),
  unitCount: integer("unit_count").notNull(),
  yearBuilt: integer("year_built").notNull(),
  imageUrl: text("image_url"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const units = sqliteTable("units", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  unitNumber: text("unit_number").notNull(),
  status: text("status", { enum: ["occupied", "vacant", "maintenance"] }).notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: real("bathrooms").notNull(),
  squareFeet: integer("square_feet").notNull(),
  /** Stored in USD cents to avoid floating-point arithmetic errors. */
  monthlyRent: integer("monthly_rent").notNull(),
  tenantId: text("tenant_id"),
});

export const tenants = sqliteTable("tenants", {
  id: text("id").primaryKey(),
  unitId: text("unit_id")
    .notNull()
    .references(() => units.id),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  /** ISO 8601 date string. */
  leaseStart: text("lease_start").notNull(),
  /** ISO 8601 date string. */
  leaseEnd: text("lease_end").notNull(),
  /** Stored in USD cents. */
  monthlyRent: integer("monthly_rent").notNull(),
  /** Stored in USD cents. */
  securityDeposit: integer("security_deposit").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
});

export const maintenanceRequests = sqliteTable("maintenance_requests", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),
  unitId: text("unit_id")
    .notNull()
    .references(() => units.id),
  tenantId: text("tenant_id")
    .notNull()
    .references(() => tenants.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "emergency"] }).notNull(),
  status: text("status", {
    enum: ["open", "in_progress", "resolved", "closed"],
  })
    .notNull()
    .default("open"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text("updated_at").notNull().$defaultFn(() => new Date().toISOString()),
  resolvedAt: text("resolved_at"),
});

// ─── Inferred types ───────────────────────────────────────────────────────────
// Schema is the single source of truth — no hand-written interfaces needed.

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Unit = typeof units.$inferSelect;
export type NewUnit = typeof units.$inferInsert;
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;
export type MaintenanceRequest = typeof maintenanceRequests.$inferSelect;
export type NewMaintenanceRequest = typeof maintenanceRequests.$inferInsert;

// ─── Derived types ────────────────────────────────────────────────────────────

export type LeaseStatus = "active" | "expiring_soon" | "expired" | "pending";

export type PropertySummary = Property & {
  occupancyRate: number;
  occupiedUnits: number;
  vacantUnits: number;
  /** Monthly revenue from occupied units, in cents. */
  monthlyRevenue: number;
};

export type TenantWithLeaseStatus = Tenant & {
  leaseStatus: LeaseStatus;
  propertyName: string;
  unitNumber: string;
};

export type DashboardStats = {
  totalProperties: number;
  totalUnits: number;
  occupiedUnits: number;
  occupancyRate: number;
  /** Sum of occupied unit rents, in cents. */
  monthlyRevenue: number;
  openMaintenanceRequests: number;
};

export type MonthlyRevenueDatum = {
  month: string;
  /** Revenue in cents. */
  revenue: number;
  /** Expenses in cents. */
  expenses: number;
};

export type ActivityItem = {
  id: string;
  type: "lease_signed" | "payment_received" | "maintenance_opened" | "tenant_moved_out";
  description: string;
  propertyName: string;
  timestamp: string;
  href: string;
};

export type UnitStatusBreakdown = {
  occupied: number;
  vacant: number;
  maintenance: number;
};
