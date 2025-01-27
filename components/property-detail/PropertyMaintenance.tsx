import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MaintenanceRequestWithContext } from "@/db/queries/maintenance";
import { formatDate } from "@/lib/formatters";
import { PriorityBadge } from "@/components/maintenance/PriorityBadge";
import { StatusBadge } from "@/components/maintenance/StatusBadge";

type PropertyMaintenanceProps = {
  requests: MaintenanceRequestWithContext[];
};

export function PropertyMaintenance({ requests }: PropertyMaintenanceProps) {
  if (requests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No maintenance requests for this property.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issue</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Reported</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.map((request) => (
          <TableRow
            key={request.id}
            className={
              request.priority === "emergency"
                ? "bg-rose-50/60 dark:bg-rose-950/20"
                : undefined
            }
          >
            <TableCell>
              <p className="font-medium">{request.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{request.description}</p>
            </TableCell>
            <TableCell className="text-sm">{request.unitNumber}</TableCell>
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
        ))}
      </TableBody>
    </Table>
  );
}
