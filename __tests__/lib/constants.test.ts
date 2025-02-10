import { describe, expect, it } from "vitest";
import {
  NAV_ITEMS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  UNIT_STATUS_LABELS,
  LEASE_STATUS_LABELS,
  PROPERTY_TYPE_LABELS,
} from "@/lib/constants";

describe("NAV_ITEMS", () => {
  it("contains expected navigation routes", () => {
    const hrefs = NAV_ITEMS.map((item) => item.href);
    expect(hrefs).toContain("/");
    expect(hrefs).toContain("/properties");
    expect(hrefs).toContain("/tenants");
    expect(hrefs).toContain("/maintenance");
    expect(hrefs).toContain("/settings");
  });

  it("each item has label, href, and icon", () => {
    for (const item of NAV_ITEMS) {
      expect(item.label).toBeTruthy();
      expect(item.href).toBeTruthy();
      expect(item.icon).toBeDefined();
    }
  });
});

describe("PRIORITY_LABELS", () => {
  it("has labels for all priorities", () => {
    expect(PRIORITY_LABELS).toEqual({
      low: "Low",
      medium: "Medium",
      high: "High",
      emergency: "Emergency",
    });
  });
});

describe("STATUS_LABELS", () => {
  it("has labels for all maintenance statuses", () => {
    expect(STATUS_LABELS).toEqual({
      open: "Open",
      in_progress: "In Progress",
      resolved: "Resolved",
      closed: "Closed",
    });
  });
});

describe("UNIT_STATUS_LABELS", () => {
  it("has labels for all unit statuses", () => {
    expect(UNIT_STATUS_LABELS).toEqual({
      occupied: "Occupied",
      vacant: "Vacant",
      maintenance: "Maintenance",
    });
  });
});

describe("LEASE_STATUS_LABELS", () => {
  it("has labels for all lease statuses", () => {
    expect(LEASE_STATUS_LABELS).toEqual({
      active: "Active",
      expiring_soon: "Expiring Soon",
      expired: "Expired",
      pending: "Pending",
    });
  });
});

describe("PROPERTY_TYPE_LABELS", () => {
  it("has labels for all property types", () => {
    expect(PROPERTY_TYPE_LABELS).toEqual({
      apartment: "Apartment",
      house: "House",
      condo: "Condo",
      commercial: "Commercial",
    });
  });
});
