import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";
import type { Property, Unit, Tenant } from "@/db/schema";

const PROPERTIES: Property[] = [
  {
    id: "p1",
    name: "Sunset Arms",
    type: "apartment",
    street: "123 Main",
    city: "Portland",
    state: "OR",
    zip: "97201",
    unitCount: 10,
    yearBuilt: 2000,
    imageUrl: null,
    createdAt: "2026-01-01T00:00:00Z",
  },
];

const OCCUPIED_UNITS: Unit[] = [
  {
    id: "u1",
    propertyId: "p1",
    unitNumber: "101",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 800,
    monthlyRent: 150000,
    tenantId: "t1",
  },
];

const TENANTS: Tenant[] = [
  {
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
  },
];

describe("MaintenanceForm", () => {
  it("renders all form fields", () => {
    render(
      <MaintenanceForm
        properties={PROPERTIES}
        occupiedUnits={OCCUPIED_UNITS}
        tenants={TENANTS}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/issue title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/property/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
  });

  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <MaintenanceForm
        properties={PROPERTIES}
        occupiedUnits={OCCUPIED_UNITS}
        tenants={TENANTS}
        onSubmit={onSubmit}
      />,
    );
    await user.click(screen.getByRole("button", { name: /submit request/i }));
    await waitFor(() => {
      expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("renders submit button", () => {
    render(
      <MaintenanceForm
        properties={PROPERTIES}
        occupiedUnits={OCCUPIED_UNITS}
        tenants={TENANTS}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /submit request/i })).toBeInTheDocument();
  });
});
