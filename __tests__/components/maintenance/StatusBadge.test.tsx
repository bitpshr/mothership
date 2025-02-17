import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/maintenance/StatusBadge";

describe("StatusBadge", () => {
  it("renders 'Open' for open status", () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders 'In Progress' for in_progress status", () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("renders 'Resolved' for resolved status", () => {
    render(<StatusBadge status="resolved" />);
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("renders 'Closed' for closed status", () => {
    render(<StatusBadge status="closed" />);
    expect(screen.getByText("Closed")).toBeInTheDocument();
  });
});
