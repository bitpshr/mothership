import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TenantsTable } from "@/components/tenants/TenantsTable";
import type { TenantWithLeaseStatus } from "@/db/schema";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));
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
    securityDeposit: 250000,
    createdAt: "2026-01-01T00:00:00Z",
    leaseStatus: "active",
    propertyName: "Sunset Arms",
    unitNumber: "101",
    ...overrides,
  };
}

const TENANTS = [
  makeTenant({ id: "t1", firstName: "Alice", lastName: "Johnson" }),
  makeTenant({ id: "t2", firstName: "Bob", lastName: "Smith", email: "bob@example.com", propertyName: "Cedar Heights" }),
];

describe("TenantsTable", () => {
  it("renders a search input", () => {
    render(<TenantsTable tenants={TENANTS} />);
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument();
  });

  it("renders all tenant names", () => {
    render(<TenantsTable tenants={TENANTS} />);
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  });

  it("filters tenants by name", async () => {
    const user = userEvent.setup();
    render(<TenantsTable tenants={TENANTS} />);
    await user.type(screen.getByPlaceholderText(/search/i), "Bob");
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("filters tenants by email", async () => {
    const user = userEvent.setup();
    render(<TenantsTable tenants={TENANTS} />);
    await user.type(screen.getByPlaceholderText(/search/i), "bob@");
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("shows empty state when no matches", async () => {
    const user = userEvent.setup();
    render(<TenantsTable tenants={TENANTS} />);
    await user.type(screen.getByPlaceholderText(/search/i), "zzz");
    expect(screen.getByText(/no tenants match/i)).toBeInTheDocument();
  });

  it("renders property name and unit", () => {
    render(<TenantsTable tenants={TENANTS} />);
    expect(screen.getByText("Sunset Arms")).toBeInTheDocument();
    expect(screen.getByText("Cedar Heights")).toBeInTheDocument();
  });

  it("renders sortable column headers", () => {
    render(<TenantsTable tenants={TENANTS} />);
    expect(screen.getByRole("button", { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /lease end/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /rent/i })).toBeInTheDocument();
  });
});
