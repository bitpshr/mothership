import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  emergency: "Emergency",
};

export const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const UNIT_STATUS_LABELS: Record<string, string> = {
  occupied: "Occupied",
  vacant: "Vacant",
  maintenance: "Maintenance",
};

export const LEASE_STATUS_LABELS: Record<string, string> = {
  active: "Active",
  expiring_soon: "Expiring Soon",
  expired: "Expired",
  pending: "Pending",
};

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  condo: "Condo",
  commercial: "Commercial",
};
