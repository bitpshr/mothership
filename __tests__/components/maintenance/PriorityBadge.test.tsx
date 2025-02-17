import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriorityBadge } from "@/components/maintenance/PriorityBadge";

describe("PriorityBadge", () => {
  it("renders 'Low' for low priority", () => {
    render(<PriorityBadge priority="low" />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });

  it("renders 'Medium' for medium priority", () => {
    render(<PriorityBadge priority="medium" />);
    expect(screen.getByText("Medium")).toBeInTheDocument();
  });

  it("renders 'High' for high priority", () => {
    render(<PriorityBadge priority="high" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders 'Emergency' for emergency priority", () => {
    render(<PriorityBadge priority="emergency" />);
    expect(screen.getByText("Emergency")).toBeInTheDocument();
  });
});
