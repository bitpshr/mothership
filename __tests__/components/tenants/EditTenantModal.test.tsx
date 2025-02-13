import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditTenantModal } from "@/components/tenants/EditTenantModal";
import type { TenantWithLeaseStatus } from "@/db/schema";

vi.mock("@/actions/tenants", () => ({ updateTenant: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

function makeTenant(overrides: Partial<TenantWithLeaseStatus> = {}): TenantWithLeaseStatus {
  return {
    id: "t1",
    unitId: "u1",
    propertyId: "p1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "555-1234",
    leaseStart: "2026-01-01",
    leaseEnd: "2027-01-01",
    monthlyRent: 250000,
    securityDeposit: 250000,
    createdAt: "2026-01-01T00:00:00Z",
    leaseStatus: "active",
    propertyName: "Sunset Arms",
    unitNumber: "101",
    ...overrides,
  };
}

describe("EditTenantModal", () => {
  it("returns null when tenant is null", () => {
    const { container } = render(
      <EditTenantModal tenant={null} open={true} onOpenChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders dialog title when tenant is provided", () => {
    render(
      <EditTenantModal tenant={makeTenant()} open={true} onOpenChange={vi.fn()} />,
    );
    expect(screen.getByText("Edit Tenant")).toBeInTheDocument();
  });

  it("pre-fills form with tenant data", () => {
    render(
      <EditTenantModal tenant={makeTenant()} open={true} onOpenChange={vi.fn()} />,
    );
    expect(screen.getByDisplayValue("Alice")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Johnson")).toBeInTheDocument();
    expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
  });

  it("converts cents to dollars for rent fields", () => {
    render(
      <EditTenantModal
        tenant={makeTenant({ monthlyRent: 250000, securityDeposit: 500000 })}
        open={true}
        onOpenChange={vi.fn()}
      />,
    );
    expect(screen.getByDisplayValue("2500")).toBeInTheDocument();
    expect(screen.getByDisplayValue("5000")).toBeInTheDocument();
  });

  it("shows Save Changes button", () => {
    render(
      <EditTenantModal tenant={makeTenant()} open={true} onOpenChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
