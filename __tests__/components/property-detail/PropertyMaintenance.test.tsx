import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PropertyMaintenance } from "@/components/property-detail/PropertyMaintenance";
import type { MaintenanceRequestWithContext } from "@/db/queries/maintenance";

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

describe("PropertyMaintenance", () => {
  it("shows empty state when no requests", () => {
    render(<PropertyMaintenance requests={[]} />);
    expect(screen.getByText(/no maintenance requests/i)).toBeInTheDocument();
  });

  it("renders table headers", () => {
    render(<PropertyMaintenance requests={[makeRequest()]} />);
    expect(screen.getByText("Issue")).toBeInTheDocument();
    expect(screen.getByText("Unit")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Reported")).toBeInTheDocument();
  });

  it("renders request title and description", () => {
    render(<PropertyMaintenance requests={[makeRequest()]} />);
    expect(screen.getByText("Leaky faucet")).toBeInTheDocument();
    expect(screen.getByText("Kitchen faucet dripping")).toBeInTheDocument();
  });

  it("renders unit number", () => {
    render(<PropertyMaintenance requests={[makeRequest({ unitNumber: "205" })]} />);
    expect(screen.getByText("205")).toBeInTheDocument();
  });

  it("renders multiple requests", () => {
    const requests = [
      makeRequest({ id: "r1", title: "Leaky faucet" }),
      makeRequest({ id: "r2", title: "Broken lock" }),
    ];
    render(<PropertyMaintenance requests={requests} />);
    expect(screen.getByText("Leaky faucet")).toBeInTheDocument();
    expect(screen.getByText("Broken lock")).toBeInTheDocument();
  });
});
