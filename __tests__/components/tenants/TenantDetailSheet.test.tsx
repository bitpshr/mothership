import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TenantDetailSheet } from "@/components/tenants/TenantDetailSheet";
import type { TenantWithLeaseStatus } from "@/db/schema";

vi.mock("@/actions/tenants", () => ({
  deleteTenant: vi.fn(),
  updateTenant: vi.fn(),
}));
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
    securityDeposit: 500000,
    createdAt: "2026-01-01T00:00:00Z",
    leaseStatus: "active",
    propertyName: "Sunset Arms",
    unitNumber: "101",
    ...overrides,
  };
}

describe("TenantDetailSheet", () => {
  it("returns null when tenant is null", () => {
    const { container } = render(
      <TenantDetailSheet tenant={null} open={true} onClose={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders tenant full name", () => {
    render(
      <TenantDetailSheet tenant={makeTenant()} open={true} onClose={vi.fn()} />,
    );
    // Name appears in both sr-only SheetTitle and visible h2
    expect(screen.getAllByText("Alice Johnson").length).toBeGreaterThanOrEqual(1);
  });

  it("renders initials in avatar", () => {
    render(
      <TenantDetailSheet tenant={makeTenant()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("AJ")).toBeInTheDocument();
  });

  it("renders contact info", () => {
    render(
      <TenantDetailSheet tenant={makeTenant()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("555-1234")).toBeInTheDocument();
  });

  it("renders property and unit info", () => {
    render(
      <TenantDetailSheet tenant={makeTenant()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("Sunset Arms")).toBeInTheDocument();
    expect(screen.getByText("Unit 101")).toBeInTheDocument();
  });

  it("renders formatted financial values", () => {
    render(
      <TenantDetailSheet tenant={makeTenant()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("$2,500.00")).toBeInTheDocument();
    expect(screen.getByText("$5,000.00")).toBeInTheDocument();
  });

  it("renders Edit and Delete action buttons", () => {
    render(
      <TenantDetailSheet tenant={makeTenant()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: /edit tenant/i })).toBeInTheDocument();
  });

  it("renders section headings", () => {
    render(
      <TenantDetailSheet tenant={makeTenant()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("Contact")).toBeInTheDocument();
    expect(screen.getByText("Property")).toBeInTheDocument();
    expect(screen.getByText("Lease")).toBeInTheDocument();
    expect(screen.getByText("Financials")).toBeInTheDocument();
  });
});
