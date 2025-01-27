import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Unit } from "@/db/schema";
import { formatCurrency } from "@/lib/formatters";
import { UNIT_STATUS_LABELS } from "@/lib/constants";

const STATUS_COLORS: Record<Unit["status"], string> = {
  occupied: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
  vacant: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  maintenance: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
};

type UnitsListProps = {
  units: Unit[];
};

export function UnitsList({ units }: UnitsListProps) {
  if (units.length === 0) {
    return <p className="text-sm text-muted-foreground">No units found for this property.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Unit</TableHead>
          <TableHead>Beds / Baths</TableHead>
          <TableHead>Sq Ft</TableHead>
          <TableHead>Rent</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {units.map((unit) => (
          <TableRow key={unit.id}>
            <TableCell className="font-medium">{unit.unitNumber}</TableCell>
            <TableCell>
              {unit.bedrooms} bd / {unit.bathrooms} ba
            </TableCell>
            <TableCell>{unit.squareFeet.toLocaleString()} sqft</TableCell>
            <TableCell>{formatCurrency(unit.monthlyRent)}/mo</TableCell>
            <TableCell>
              <Badge className={STATUS_COLORS[unit.status]}>
                {UNIT_STATUS_LABELS[unit.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
