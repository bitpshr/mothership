import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OccupancyBadge } from "@/components/properties/OccupancyBadge";

describe("OccupancyBadge", () => {
  it("displays formatted occupancy percentage", () => {
    render(<OccupancyBadge rate={0.75} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("shows 0% for empty property", () => {
    render(<OccupancyBadge rate={0} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("shows 100% for fully occupied property", () => {
    render(<OccupancyBadge rate={1} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });
});
