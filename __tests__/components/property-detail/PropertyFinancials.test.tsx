import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PropertyFinancials } from "@/components/property-detail/PropertyFinancials";
import type { Unit } from "@/db/schema";

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: "u1",
    propertyId: "p1",
    unitNumber: "101",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 800,
    monthlyRent: 150000, // $1,500
    tenantId: "t1",
    ...overrides,
  };
}

describe("PropertyFinancials", () => {
  it("renders all three stat cards", () => {
    const units = [makeUnit()];
    render(<PropertyFinancials units={units} />);
    expect(screen.getByText("Gross Revenue")).toBeInTheDocument();
    expect(screen.getByText("Est. Expenses")).toBeInTheDocument();
    expect(screen.getByText("Net Operating Income")).toBeInTheDocument();
  });

  it("computes gross revenue from occupied units only", () => {
    const units = [
      makeUnit({ id: "u1", monthlyRent: 100000, status: "occupied" }),
      makeUnit({ id: "u2", monthlyRent: 200000, status: "occupied" }),
      makeUnit({ id: "u3", monthlyRent: 150000, status: "vacant" }),
    ];
    render(<PropertyFinancials units={units} />);
    // Gross = 100000 + 200000 = 300000 cents = $3,000.00
    expect(screen.getByText("$3,000.00")).toBeInTheDocument();
  });

  it("shows $0.00 values when no occupied units", () => {
    const units = [makeUnit({ status: "vacant", monthlyRent: 100000 })];
    render(<PropertyFinancials units={units} />);
    expect(screen.getAllByText("$0.00")).toHaveLength(3);
  });

  it("displays description with occupied unit count", () => {
    const units = [
      makeUnit({ id: "u1", status: "occupied" }),
      makeUnit({ id: "u2", status: "occupied" }),
    ];
    render(<PropertyFinancials units={units} />);
    expect(screen.getByText(/From 2 occupied units/)).toBeInTheDocument();
  });
});
