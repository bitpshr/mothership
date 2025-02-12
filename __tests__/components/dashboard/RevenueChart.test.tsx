import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import type { MonthlyRevenueDatum } from "@/db/schema";

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

const MOCK_DATA: MonthlyRevenueDatum[] = [
  { month: "Jan", revenue: 500000, expenses: 175000 },
  { month: "Feb", revenue: 600000, expenses: 210000 },
  { month: "Mar", revenue: 550000, expenses: 192500 },
];

describe("RevenueChart", () => {
  it("renders card title", () => {
    render(<RevenueChart data={MOCK_DATA} />);
    expect(screen.getByText("Revenue vs. Expenses")).toBeInTheDocument();
  });

  it("computes and displays total revenue", () => {
    render(<RevenueChart data={MOCK_DATA} />);
    // Total = 500000 + 600000 + 550000 = 1650000 cents = $16,500.00
    expect(screen.getByText("$16,500.00")).toBeInTheDocument();
  });

  it("computes and displays total expenses", () => {
    render(<RevenueChart data={MOCK_DATA} />);
    // Total = 175000 + 210000 + 192500 = 577500 cents = $5,775.00
    expect(screen.getByText("$5,775.00")).toBeInTheDocument();
  });

  it("renders summary pill labels", () => {
    render(<RevenueChart data={MOCK_DATA} />);
    // "Revenue" appears in both summary pill and legend
    expect(screen.getAllByText("Revenue").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Expenses").length).toBeGreaterThanOrEqual(1);
  });

  it("handles empty data gracefully", () => {
    render(<RevenueChart data={[]} />);
    expect(screen.getByText("Revenue vs. Expenses")).toBeInTheDocument();
    expect(screen.getAllByText("$0.00").length).toBeGreaterThanOrEqual(1);
  });
});
