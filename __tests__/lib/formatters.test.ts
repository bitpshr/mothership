import { describe, expect, it } from "vitest";
import {
  computeLeaseStatus,
  formatCurrency,
  formatDate,
  formatOccupancy,
  formatRelativeTime,
} from "@/lib/formatters";

describe("formatCurrency", () => {
  it("formats zero cents as $0.00", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("formats 220000 cents as $2,200.00", () => {
    expect(formatCurrency(220000)).toBe("$2,200.00");
  });

  it("formats large values with proper comma separators", () => {
    expect(formatCurrency(1000000)).toBe("$10,000.00");
  });

  it("formats odd cent values correctly", () => {
    expect(formatCurrency(99)).toBe("$0.99");
  });
});

describe("formatOccupancy", () => {
  it("formats 0 as 0%", () => {
    expect(formatOccupancy(0)).toBe("0%");
  });

  it("formats 1 as 100%", () => {
    expect(formatOccupancy(1)).toBe("100%");
  });

  it("formats 0.75 as 75%", () => {
    expect(formatOccupancy(0.75)).toBe("75%");
  });

  it("rounds fractional rates", () => {
    expect(formatOccupancy(0.333)).toBe("33%");
  });
});

describe("computeLeaseStatus", () => {
  const futureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  it("returns 'expired' when lease end is in the past", () => {
    expect(computeLeaseStatus("2020-01-01")).toBe("expired");
  });

  it("returns 'expiring_soon' when lease ends in 30 days", () => {
    expect(computeLeaseStatus(futureDate(30))).toBe("expiring_soon");
  });

  it("returns 'expiring_soon' when lease ends exactly at 60 days", () => {
    expect(computeLeaseStatus(futureDate(60))).toBe("expiring_soon");
  });

  it("returns 'active' when lease ends in 90 days", () => {
    expect(computeLeaseStatus(futureDate(90))).toBe("active");
  });
});

describe("formatDate", () => {
  it("formats an ISO date string to a recognizable month and year", () => {
    // Use noon UTC to avoid date shifting across timezone boundaries in CI
    const result = formatDate("2026-06-15T12:00:00Z");
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/2026/);
  });
});

describe("formatRelativeTime", () => {
  it("returns a string containing 'ago' for past dates", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 3);
    expect(formatRelativeTime(pastDate.toISOString())).toMatch(/ago/);
  });

  it("returns a string containing 'in' for future dates", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    expect(formatRelativeTime(futureDate.toISOString())).toMatch(/in/);
  });
});
