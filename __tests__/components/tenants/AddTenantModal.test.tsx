import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddTenantModal } from "@/components/tenants/AddTenantModal";

vi.mock("@/actions/tenants", () => ({ createTenant: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const PROPS = { properties: [], vacantUnits: [] };

describe("AddTenantModal", () => {
  it("renders the trigger button in uncontrolled mode", () => {
    render(<AddTenantModal {...PROPS} />);
    expect(screen.getByRole("button", { name: /add tenant/i })).toBeInTheDocument();
  });

  it("does not render trigger button in controlled mode", () => {
    render(<AddTenantModal {...PROPS} open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /add tenant/i })).not.toBeInTheDocument();
  });
});
