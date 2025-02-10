import { describe, expect, it } from "vitest";
import {
  propertySchema,
  tenantSchema,
  updateTenantSchema,
  maintenanceRequestSchema,
} from "@/lib/schemas";

describe("propertySchema", () => {
  const valid = {
    name: "Sunset Arms",
    type: "apartment" as const,
    street: "123 Main Street",
    city: "Portland",
    state: "OR",
    zip: "97201",
    unitCount: 12,
    yearBuilt: 1995,
  };

  it("accepts valid property data", () => {
    expect(() => propertySchema.parse(valid)).not.toThrow();
  });

  it("rejects name shorter than 2 characters", () => {
    expect(() => propertySchema.parse({ ...valid, name: "A" })).toThrow(/at least 2/);
  });

  it("rejects invalid property type", () => {
    expect(() => propertySchema.parse({ ...valid, type: "garage" })).toThrow();
  });

  it("rejects invalid state code", () => {
    expect(() => propertySchema.parse({ ...valid, state: "Oregon" })).toThrow(/2-letter/);
  });

  it("rejects invalid zip code", () => {
    expect(() => propertySchema.parse({ ...valid, zip: "ABC" })).toThrow(/valid ZIP/);
  });

  it("accepts zip+4 format", () => {
    expect(() => propertySchema.parse({ ...valid, zip: "97201-1234" })).not.toThrow();
  });

  it("rejects unit count of 0", () => {
    expect(() => propertySchema.parse({ ...valid, unitCount: 0 })).toThrow(/at least 1/);
  });

  it("rejects year before 1800", () => {
    expect(() => propertySchema.parse({ ...valid, yearBuilt: 1799 })).toThrow(/after 1800/);
  });

  it("rejects year in the future", () => {
    expect(() =>
      propertySchema.parse({ ...valid, yearBuilt: new Date().getFullYear() + 1 }),
    ).toThrow(/future/);
  });
});

describe("tenantSchema", () => {
  const valid = {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "555-1234",
    propertyId: "prop-1",
    unitId: "unit-1",
    leaseStart: "2026-01-01",
    leaseEnd: "2027-01-01",
    monthlyRent: 1500,
    securityDeposit: 1500,
  };

  it("accepts valid tenant data", () => {
    expect(() => tenantSchema.parse(valid)).not.toThrow();
  });

  it("rejects empty first name", () => {
    expect(() => tenantSchema.parse({ ...valid, firstName: "" })).toThrow();
  });

  it("rejects invalid email", () => {
    expect(() => tenantSchema.parse({ ...valid, email: "not-an-email" })).toThrow(/email/);
  });

  it("rejects short phone number", () => {
    expect(() => tenantSchema.parse({ ...valid, phone: "123" })).toThrow(/phone/);
  });

  it("rejects zero monthly rent", () => {
    expect(() => tenantSchema.parse({ ...valid, monthlyRent: 0 })).toThrow();
  });

  it("allows zero security deposit", () => {
    expect(() => tenantSchema.parse({ ...valid, securityDeposit: 0 })).not.toThrow();
  });

  it("rejects missing property or unit", () => {
    expect(() => tenantSchema.parse({ ...valid, propertyId: "" })).toThrow();
    expect(() => tenantSchema.parse({ ...valid, unitId: "" })).toThrow();
  });
});

describe("updateTenantSchema", () => {
  const valid = {
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "555-1234",
    leaseStart: "2026-01-01",
    leaseEnd: "2027-01-01",
    monthlyRent: 1500,
    securityDeposit: 1500,
  };

  it("accepts valid update data", () => {
    expect(() => updateTenantSchema.parse(valid)).not.toThrow();
  });

  it("does not require propertyId or unitId", () => {
    // updateTenantSchema should not have propertyId/unitId fields
    const result = updateTenantSchema.safeParse({ ...valid, propertyId: "p1" });
    // Extra keys are stripped in strict mode or ignored — just ensure it parses
    expect(result.success).toBe(true);
  });
});

describe("maintenanceRequestSchema", () => {
  const valid = {
    title: "Leaky faucet in kitchen",
    description: "The kitchen faucet has been dripping for a week",
    priority: "medium" as const,
    propertyId: "prop-1",
    unitId: "unit-1",
    tenantId: "tenant-1",
  };

  it("accepts valid maintenance request data", () => {
    expect(() => maintenanceRequestSchema.parse(valid)).not.toThrow();
  });

  it("rejects title shorter than 5 characters", () => {
    expect(() => maintenanceRequestSchema.parse({ ...valid, title: "Fix" })).toThrow(/5 char/);
  });

  it("rejects description shorter than 10 characters", () => {
    expect(() => maintenanceRequestSchema.parse({ ...valid, description: "Short" })).toThrow(
      /more detail/,
    );
  });

  it("rejects invalid priority", () => {
    expect(() => maintenanceRequestSchema.parse({ ...valid, priority: "critical" })).toThrow();
  });

  it("accepts all valid priority levels", () => {
    for (const priority of ["low", "medium", "high", "emergency"]) {
      expect(() => maintenanceRequestSchema.parse({ ...valid, priority })).not.toThrow();
    }
  });
});
