import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "@/components/shared/Pagination";

vi.mock("next/navigation", () => ({
  usePathname: () => "/tenants",
  useSearchParams: () => new URLSearchParams("page=2"),
}));

describe("Pagination", () => {
  it("returns null when only one page", () => {
    const { container } = render(<Pagination page={1} pageSize={10} total={5} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders page info and range", () => {
    render(<Pagination page={2} pageSize={10} total={25} />);
    expect(screen.getByText("11–20 of 25")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
  });

  it("renders previous and next buttons", () => {
    render(<Pagination page={2} pageSize={10} total={30} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
  });

  it("clamps range on last page", () => {
    render(<Pagination page={3} pageSize={10} total={25} />);
    expect(screen.getByText("21–25 of 25")).toBeInTheDocument();
  });

  it("shows first page range correctly", () => {
    render(<Pagination page={1} pageSize={10} total={25} />);
    expect(screen.getByText("1–10 of 25")).toBeInTheDocument();
  });
});
