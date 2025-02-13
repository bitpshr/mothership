import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TenantForm } from "@/components/tenants/TenantForm";
import type { Property, Unit } from "@/db/schema";

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

const VACANT_UNITS: Unit[] = [
  {
    id: "u1",
    propertyId: "p1",
    unitNumber: "101",
    status: "vacant",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 800,
    monthlyRent: 150000,
    tenantId: null,
  },
];

describe("TenantForm", () => {
  it("renders all form fields", () => {
    render(<TenantForm properties={PROPERTIES} vacantUnits={VACANT_UNITS} onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lease start/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lease end/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly rent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/security deposit/i)).toBeInTheDocument();
  });

  it("does not call onSubmit when submitted with invalid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TenantForm properties={PROPERTIES} vacantUnits={VACANT_UNITS} onSubmit={onSubmit} />);
    await user.click(screen.getByRole("button", { name: /add tenant/i }));
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("renders submit button with correct text", () => {
    render(<TenantForm properties={PROPERTIES} vacantUnits={VACANT_UNITS} onSubmit={vi.fn()} />);
    expect(screen.getByRole("button", { name: /add tenant/i })).toBeInTheDocument();
  });
});
