import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RequestsTable } from "@/components/maintenance/RequestsTable";
import type { MaintenanceRequestWithContext } from "@/db/queries/maintenance";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
}));
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
    description: "Kitchen faucet dripping",
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

const REQUESTS = [
  makeRequest({ id: "r1", title: "Leaky faucet", priority: "medium", status: "open" }),
  makeRequest({
    id: "r2",
    title: "Broken window",
    priority: "emergency",
    status: "in_progress",
    propertyName: "Cedar Heights",
  }),
];

describe("RequestsTable", () => {
  it("renders table headers", () => {
    render(<RequestsTable requests={REQUESTS} />);
    expect(screen.getByText("Issue")).toBeInTheDocument();
    expect(screen.getByText("Property / Unit")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("renders all request titles", () => {
    render(<RequestsTable requests={REQUESTS} />);
    expect(screen.getByText("Leaky faucet")).toBeInTheDocument();
    expect(screen.getByText("Broken window")).toBeInTheDocument();
  });

  it("displays request count", () => {
    render(<RequestsTable requests={REQUESTS} />);
    expect(screen.getByText("2 of 2 requests")).toBeInTheDocument();
  });

  it("shows empty state when no requests", () => {
    render(<RequestsTable requests={[]} />);
    expect(screen.getByText(/no requests match/i)).toBeInTheDocument();
  });

  it("renders property name and unit for each request", () => {
    render(<RequestsTable requests={REQUESTS} />);
    expect(screen.getByText("Sunset Arms")).toBeInTheDocument();
    expect(screen.getByText("Cedar Heights")).toBeInTheDocument();
  });

  it("renders priority and status filter selects", () => {
    render(<RequestsTable requests={REQUESTS} />);
    // Two select triggers (priority + status)
    const triggers = screen.getAllByRole("combobox");
    expect(triggers.length).toBe(2);
  });
});
