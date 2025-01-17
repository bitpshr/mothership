"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Anchor, LayoutDashboard, Building2, Users, Wrench, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

const PORTFOLIO_NAV = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Properties", href: "/properties", icon: Building2 },
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
];

const ACCOUNT_NAV = [
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function navItem(item: { label: string; href: string; icon: React.ElementType }) {
    const active = isActive(item.href);
    return (
      <SidebarMenuItem key={item.href} className="relative">
        {active && (
          <span className="pointer-events-none absolute bottom-1 left-0 top-1 z-10 w-0.5 rounded-full bg-primary" />
        )}
        <SidebarMenuButton
          asChild
          isActive={active}
          tooltip={item.label}
          className={cn(
            "transition-colors",
            active
              ? "bg-sidebar-accent text-foreground font-semibold hover:bg-sidebar-accent hover:text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
          )}
        >
          <Link href={item.href}>
            <item.icon />
            <span>{item.label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                  <Anchor className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Mothership</span>
                  <span className="text-xs text-muted-foreground">Property Manager</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase group-data-[collapsible=icon]:hidden">
            Portfolio
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {PORTFOLIO_NAV.map(navItem)}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="px-2 py-0">
          <SidebarGroupLabel className="mb-1 px-2 text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase group-data-[collapsible=icon]:hidden">
            Account
          </SidebarGroupLabel>
          <SidebarMenu className="gap-0.5">
            {ACCOUNT_NAV.map(navItem)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[11px] font-bold text-white shadow-sm select-none">
            PM
          </div>
          <div className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-medium leading-none">Property Manager</span>
            <span className="mt-0.5 truncate text-xs leading-none text-muted-foreground">
              Portfolio Admin
            </span>
          </div>
          <div className="shrink-0 group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
