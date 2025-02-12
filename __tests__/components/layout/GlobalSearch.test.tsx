import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/actions/search", () => ({
  searchAll: vi.fn().mockResolvedValue([]),
}));

describe("GlobalSearch", () => {
  it("renders search input with placeholder", () => {
    render(<GlobalSearch />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("renders keyboard shortcut hint", () => {
    render(<GlobalSearch />);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("does not show dropdown for short queries", async () => {
    const user = userEvent.setup();
    render(<GlobalSearch />);
    await user.type(screen.getByPlaceholderText(/search/i), "a");
    // Dropdown should not appear for single character
    expect(screen.queryByText(/no results/i)).not.toBeInTheDocument();
  });

  it("shows no results for query with no matches", async () => {
    const user = userEvent.setup();
    render(<GlobalSearch />);
    await user.type(screen.getByPlaceholderText(/search/i), "zzz");
    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
  });
});
