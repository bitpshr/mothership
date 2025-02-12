import { render, screen } from "@testing-library/react";
import { Building2 } from "lucide-react";
import { describe, expect, it } from "vitest";
import { StatCard } from "@/components/dashboard/StatCard";

describe("StatCard", () => {
  it("renders the label", () => {
    render(<StatCard label="Total Properties" value={5} icon={Building2} />);
    expect(screen.getByText("Total Properties")).toBeInTheDocument();
  });

  it("renders a numeric value", () => {
    render(<StatCard label="Total Properties" value={42} icon={Building2} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("formats currency values when format='currency'", () => {
    render(<StatCard label="Revenue" value={220000} icon={Building2} format="currency" />);
    expect(screen.getByText("$2,200.00")).toBeInTheDocument();
  });

  it("renders a description when provided", () => {
    render(
      <StatCard label="Units" value={10} icon={Building2} description="Across 3 properties" />,
    );
    expect(screen.getByText("Across 3 properties")).toBeInTheDocument();
  });

  it("renders string values directly", () => {
    render(<StatCard label="Occupancy" value="85%" icon={Building2} format="string" />);
    expect(screen.getByText("85%")).toBeInTheDocument();
  });
});
