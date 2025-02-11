import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddPropertyModal } from "@/components/properties/AddPropertyModal";

vi.mock("@/actions/properties", () => ({ createProperty: vi.fn() }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/properties",
}));

describe("AddPropertyModal", () => {
  it("renders the trigger button in uncontrolled mode", () => {
    render(<AddPropertyModal />);
    expect(screen.getByRole("button", { name: /add property/i })).toBeInTheDocument();
  });

  it("does not render trigger button in controlled mode", () => {
    render(<AddPropertyModal open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /add property/i })).not.toBeInTheDocument();
  });
});
