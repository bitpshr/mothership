import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddMaintenanceModal } from "@/components/maintenance/AddMaintenanceModal";

vi.mock("@/actions/maintenance", () => ({ createMaintenanceRequest: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const PROPS = { properties: [], occupiedUnits: [], tenants: [] };

describe("AddMaintenanceModal", () => {
  it("renders the trigger button in uncontrolled mode", () => {
    render(<AddMaintenanceModal {...PROPS} />);
    expect(screen.getByRole("button", { name: /new request/i })).toBeInTheDocument();
  });

  it("does not render trigger button in controlled mode", () => {
    render(<AddMaintenanceModal {...PROPS} open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /new request/i })).not.toBeInTheDocument();
  });
});
