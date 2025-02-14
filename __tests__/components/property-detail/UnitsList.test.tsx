import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UnitsList } from "@/components/property-detail/UnitsList";
import type { Unit } from "@/db/schema";

function makeUnit(overrides: Partial<Unit> = {}): Unit {
  return {
    id: "u1",
    propertyId: "p1",
    unitNumber: "101",
    status: "occupied",
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 850,
    monthlyRent: 150000,
    tenantId: "t1",
    ...overrides,
  };
}

describe("UnitsList", () => {
  it("shows empty message when no units", () => {
    render(<UnitsList units={[]} />);
    expect(screen.getByText("No units found for this property.")).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<UnitsList units={[makeUnit()]} />);
    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Beds / Baths")).toBeInTheDocument();
    expect(screen.getByText("Sq Ft")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("renders unit number", () => {
    render(<UnitsList units={[makeUnit({ unitNumber: "204A" })]} />);
    expect(screen.getByText("204A")).toBeInTheDocument();
  });

  it("renders bed/bath info", () => {
    render(<UnitsList units={[makeUnit({ bedrooms: 3, bathrooms: 2 })]} />);
    expect(screen.getByText("3 bd / 2 ba")).toBeInTheDocument();
  });

  it("renders formatted rent", () => {
    render(<UnitsList units={[makeUnit({ monthlyRent: 200000 })]} />);
    expect(screen.getByText("$2,000.00/mo")).toBeInTheDocument();
  });

  it("renders status badge", () => {
    render(<UnitsList units={[makeUnit({ status: "vacant" })]} />);
    expect(screen.getByText("Vacant")).toBeInTheDocument();
  });

  it("renders multiple units", () => {
    const units = [
      makeUnit({ id: "u1", unitNumber: "101" }),
      makeUnit({ id: "u2", unitNumber: "102" }),
      makeUnit({ id: "u3", unitNumber: "103" }),
    ];
    render(<UnitsList units={units} />);
    expect(screen.getByText("101")).toBeInTheDocument();
    expect(screen.getByText("102")).toBeInTheDocument();
    expect(screen.getByText("103")).toBeInTheDocument();
  });
});
