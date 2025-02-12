import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import type { ActivityItem } from "@/db/schema";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const MOCK_ITEMS: ActivityItem[] = [
  {
    id: "1",
    type: "lease_signed",
    description: "Alice signed a new lease",
    propertyName: "Sunset Arms",
    timestamp: new Date().toISOString(),
    href: "/tenants?tenant=t1",
  },
  {
    id: "2",
    type: "payment_received",
    description: "Rent payment received",
    propertyName: "Cedar Heights",
    timestamp: new Date().toISOString(),
    href: "/tenants?tenant=t2",
  },
  {
    id: "3",
    type: "maintenance_opened",
    description: "Leaky faucet reported",
    propertyName: "Sunset Arms",
    timestamp: new Date().toISOString(),
    href: "/maintenance?request=r1",
  },
];

describe("ActivityFeed", () => {
  it("renders the card title", () => {
    render(<ActivityFeed items={[]} />);
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
  });

  it("shows empty state when no items", () => {
    render(<ActivityFeed items={[]} />);
    expect(screen.getByText("No recent activity.")).toBeInTheDocument();
  });

  it("renders each activity item description", () => {
    render(<ActivityFeed items={MOCK_ITEMS} />);
    expect(screen.getByText("Alice signed a new lease")).toBeInTheDocument();
    expect(screen.getByText("Rent payment received")).toBeInTheDocument();
    expect(screen.getByText("Leaky faucet reported")).toBeInTheDocument();
  });

  it("renders property names for each item", () => {
    render(<ActivityFeed items={MOCK_ITEMS} />);
    expect(screen.getAllByText("Sunset Arms")).toHaveLength(2);
    expect(screen.getByText("Cedar Heights")).toBeInTheDocument();
  });
});
