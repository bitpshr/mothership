"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MaintenanceRequestWithContext } from "@/db/queries/maintenance";
import { formatDate } from "@/lib/formatters";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { MaintenanceRequestModal } from "./MaintenanceRequestModal";

type RequestsTableProps = {
  requests: MaintenanceRequestWithContext[];
  initialRequestId?: string;
};

export function RequestsTable({ requests, initialRequestId }: RequestsTableProps) {
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<MaintenanceRequestWithContext | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (initialRequestId) {
      const match = requests.find((r) => r.id === initialRequestId);
      if (match) setSelected(match);
      router.replace("/maintenance", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () =>
      requests.filter(
        (r) =>
          (priorityFilter === "all" || r.priority === priorityFilter) &&
          (statusFilter === "all" || r.status === statusFilter),
      ),
    [requests, priorityFilter, statusFilter],
  );

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <span className="text-sm text-muted-foreground ml-auto">
            {filtered.length} of {requests.length} requests
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue</TableHead>
              <TableHead>Property / Unit</TableHead>
              <TableHead>Reported By</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No requests match the selected filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((request) => (
                <TableRow
                  key={request.id}
                  className={`cursor-pointer ${
                    request.priority === "emergency"
                      ? "bg-rose-50/60 dark:bg-rose-950/20 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      : ""
                  }`}
                  onClick={() => setSelected(request)}
                >
                  <TableCell>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {request.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{request.propertyName}</p>
                    <p className="text-xs text-muted-foreground">Unit {request.unitNumber}</p>
                  </TableCell>
                  <TableCell className="text-sm">{request.tenantName}</TableCell>
                  <TableCell>
                    <PriorityBadge priority={request.priority} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(request.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <MaintenanceRequestModal
        request={selected}
        open={selected !== null}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
