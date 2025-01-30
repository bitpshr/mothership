"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TenantWithLeaseStatus } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { LeaseStatusBadge } from "./LeaseStatusBadge";
import { TenantDetailSheet } from "./TenantDetailSheet";

type SortField = "lastName" | "leaseEnd" | "monthlyRent";
type SortDir = "asc" | "desc";

type TenantsTableProps = {
  tenants: TenantWithLeaseStatus[];
  initialTenantId?: string;
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400",
  "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400",
];

function avatarColor(name: string): string {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export function TenantsTable({ tenants, initialTenantId }: TenantsTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("lastName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [selected, setSelected] = useState<TenantWithLeaseStatus | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialTenantId) {
      const match = tenants.find((t) => t.id === initialTenantId);
      if (match) setSelected(match);
      router.replace("/tenants", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tenants
      .filter(
        (t) =>
          !q ||
          `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
          t.propertyName.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q),
      )
      .sort((a, b) => {
        const multiplier = sortDir === "asc" ? 1 : -1;
        if (sortField === "lastName") return a.lastName.localeCompare(b.lastName) * multiplier;
        if (sortField === "leaseEnd") return a.leaseEnd.localeCompare(b.leaseEnd) * multiplier;
        return (a.monthlyRent - b.monthlyRent) * multiplier;
      });
  }, [tenants, search, sortField, sortDir]);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by name, property, or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => toggleSort("lastName")} className="-ml-3">
                Name <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Property / Unit</TableHead>
            <TableHead>Lease Status</TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => toggleSort("leaseEnd")} className="-ml-3">
                Lease End <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => toggleSort("monthlyRent")} className="-ml-3">
                Rent <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead>Contact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No tenants match your search.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((tenant) => {
              const initials = `${tenant.firstName.charAt(0)}${tenant.lastName.charAt(0)}`.toUpperCase();
              const color = avatarColor(`${tenant.firstName}${tenant.lastName}`);
              return (
                <TableRow
                  key={tenant.id}
                  className="cursor-pointer"
                  onClick={() => setSelected(tenant)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${color}`}
                      >
                        {initials}
                      </div>
                      <span className="font-medium">
                        {tenant.firstName} {tenant.lastName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{tenant.propertyName}</p>
                    <p className="text-xs text-muted-foreground">Unit {tenant.unitNumber}</p>
                  </TableCell>
                  <TableCell>
                    <LeaseStatusBadge status={tenant.leaseStatus} />
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(tenant.leaseEnd)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(tenant.monthlyRent)}/mo</TableCell>
                  <TableCell>
                    <p className="text-sm">{tenant.email}</p>
                    <p className="text-xs text-muted-foreground">{tenant.phone}</p>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <TenantDetailSheet
        tenant={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
