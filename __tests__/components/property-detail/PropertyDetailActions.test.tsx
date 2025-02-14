import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PropertyDetailActions } from "@/components/property-detail/PropertyDetailActions";
import type { Property } from "@/db/schema";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/properties/p1",
}));
vi.mock("@/actions/properties", () => ({
  updateProperty: vi.fn(),
  deleteProperty: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const PROPERTY: Property = {
  id: "p1",
  name: "Sunset Arms",
  type: "apartment",
  street: "123 Main Street",
  city: "Portland",
  state: "OR",
  zip: "97201",
  unitCount: 12,
  yearBuilt: 1995,
  imageUrl: null,
  createdAt: "2026-01-01T00:00:00Z",
};

describe("PropertyDetailActions", () => {
  it("renders Edit and Delete buttons", () => {
    render(<PropertyDetailActions property={PROPERTY} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });
});
