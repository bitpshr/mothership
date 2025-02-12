import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OccupancyChart } from "@/components/dashboard/OccupancyChart";

// Recharts relies on ResizeObserver + canvas — mock to avoid errors in jsdom
vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

describe("OccupancyChart", () => {
  it("renders card title and total units", () => {
    render(<OccupancyChart data={{ occupied: 25, vacant: 3, maintenance: 2 }} />);
    expect(screen.getByText("Unit Occupancy")).toBeInTheDocument();
    expect(screen.getByText("30 total units across portfolio")).toBeInTheDocument();
  });

  it("computes and displays occupancy rate", () => {
    render(<OccupancyChart data={{ occupied: 9, vacant: 1, maintenance: 0 }} />);
    expect(screen.getByText("90%")).toBeInTheDocument();
  });

  it("shows 0% when no units exist", () => {
    render(<OccupancyChart data={{ occupied: 0, vacant: 0, maintenance: 0 }} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
    expect(screen.getByText("0 total units across portfolio")).toBeInTheDocument();
  });

  it("renders legend labels for each segment", () => {
    render(<OccupancyChart data={{ occupied: 10, vacant: 5, maintenance: 2 }} />);
    // "Occupied" appears in both center label and legend
    expect(screen.getAllByText("Occupied").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Vacant")).toBeInTheDocument();
    expect(screen.getByText("Maintenance")).toBeInTheDocument();
  });

  it("renders segment counts in the legend", () => {
    render(<OccupancyChart data={{ occupied: 10, vacant: 5, maintenance: 2 }} />);
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
