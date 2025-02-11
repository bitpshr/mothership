import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PropertyCard } from "@/components/properties/PropertyCard";
import type { PropertySummary } from "@/db/schema";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/properties",
}));

const mockProperty: PropertySummary = {
  id: "prop_01",
  name: "Sunset Arms",
  type: "apartment",
  street: "2847 Sunset Blvd",
  city: "Los Angeles",
  state: "CA",
  zip: "90026",
  unitCount: 12,
  yearBuilt: 1998,
  imageUrl: null,
  createdAt: "2022-03-15T00:00:00Z",
  occupancyRate: 0.75,
  occupiedUnits: 9,
  vacantUnits: 3,
  monthlyRevenue: 2490000,
};

describe("PropertyCard", () => {
  it("renders the property name", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Sunset Arms")).toBeInTheDocument();
  });

  it("renders the street address", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/2847 Sunset Blvd/)).toBeInTheDocument();
  });

  it("links to the property detail page", () => {
    render(<PropertyCard property={mockProperty} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/properties/prop_01");
  });

  it("renders the occupancy badge", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("renders the property type badge", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("Apartment")).toBeInTheDocument();
  });

  it("renders the monthly revenue", () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText("$24,900.00")).toBeInTheDocument();
  });
});
