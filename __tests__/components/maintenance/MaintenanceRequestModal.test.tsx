import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MaintenanceRequestModal } from "@/components/maintenance/MaintenanceRequestModal";
import type { MaintenanceRequestWithContext } from "@/db/queries/maintenance";

vi.mock("@/actions/maintenance", () => ({
  updateRequestStatus: vi.fn(),
  updateRequestNotes: vi.fn(),
  deleteMaintenanceRequest: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

function makeRequest(
  overrides: Partial<MaintenanceRequestWithContext> = {},
): MaintenanceRequestWithContext {
  return {
    id: "r1",
    propertyId: "p1",
    unitId: "u1",
    tenantId: "t1",
    title: "Leaky faucet",
    description: "Kitchen faucet has been dripping for a week",
    priority: "medium",
    status: "open",
    notes: null,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
    resolvedAt: null,
    propertyName: "Sunset Arms",
    unitNumber: "101",
    tenantName: "Alice Johnson",
    ...overrides,
  };
}

describe("MaintenanceRequestModal", () => {
  it("returns null when request is null", () => {
    const { container } = render(
      <MaintenanceRequestModal request={null} open={true} onClose={vi.fn()} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders request title", () => {
    render(
      <MaintenanceRequestModal request={makeRequest()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("Leaky faucet")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <MaintenanceRequestModal request={makeRequest()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText(/kitchen faucet has been dripping/i)).toBeInTheDocument();
  });

  it("renders meta grid with property, unit, and tenant", () => {
    render(
      <MaintenanceRequestModal request={makeRequest()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("Sunset Arms")).toBeInTheDocument();
    expect(screen.getByText("Unit 101")).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
  });

  it("renders status transition buttons for open status", () => {
    render(
      <MaintenanceRequestModal
        request={makeRequest({ status: "open" })}
        open={true}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /start work/i })).toBeInTheDocument();
    // "Close" appears as both a transition button and dialog close — check at least 2
    expect(screen.getAllByRole("button", { name: /^close$/i }).length).toBeGreaterThanOrEqual(2);
  });

  it("renders status transition buttons for in_progress status", () => {
    render(
      <MaintenanceRequestModal
        request={makeRequest({ status: "in_progress" })}
        open={true}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /resolve/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("renders Reopen button for closed status", () => {
    render(
      <MaintenanceRequestModal
        request={makeRequest({ status: "closed" })}
        open={true}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /reopen/i })).toBeInTheDocument();
  });

  it("renders notes textarea and save button", () => {
    render(
      <MaintenanceRequestModal request={makeRequest()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByText("Internal notes")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/add notes/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save notes/i })).toBeInTheDocument();
  });

  it("renders delete button", () => {
    render(
      <MaintenanceRequestModal request={makeRequest()} open={true} onClose={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("shows resolved date when present", () => {
    render(
      <MaintenanceRequestModal
        request={makeRequest({ resolvedAt: "2026-02-01T00:00:00Z" })}
        open={true}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });
});
