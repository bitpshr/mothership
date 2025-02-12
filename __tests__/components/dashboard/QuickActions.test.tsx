import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickActions } from "@/components/dashboard/QuickActions";

vi.mock("@/actions/properties", () => ({ createProperty: vi.fn() }));
vi.mock("@/actions/tenants", () => ({ createTenant: vi.fn() }));
vi.mock("@/actions/maintenance", () => ({ createMaintenanceRequest: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const EMPTY_PROPS = {
  properties: [],
  vacantUnits: [],
  occupiedUnits: [],
  tenants: [],
};

describe("QuickActions", () => {
  it("renders the Add New trigger button", () => {
    render(<QuickActions {...EMPTY_PROPS} />);
    expect(screen.getByRole("button", { name: /add new/i })).toBeInTheDocument();
  });
});
