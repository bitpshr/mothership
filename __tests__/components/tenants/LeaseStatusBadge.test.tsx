import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeaseStatusBadge } from "@/components/tenants/LeaseStatusBadge";

describe("LeaseStatusBadge", () => {
  it("renders 'Active' for active status", () => {
    render(<LeaseStatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders 'Expiring Soon' for expiring_soon status", () => {
    render(<LeaseStatusBadge status="expiring_soon" />);
    expect(screen.getByText("Expiring Soon")).toBeInTheDocument();
  });

  it("renders 'Expired' for expired status", () => {
    render(<LeaseStatusBadge status="expired" />);
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  it("renders 'Pending' for pending status", () => {
    render(<LeaseStatusBadge status="pending" />);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
