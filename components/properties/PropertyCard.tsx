import Link from "next/link";
import { Building2, DollarSign, Home, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { PropertySummary } from "@/db/schema";
import { formatCurrency } from "@/lib/formatters";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import { OccupancyBadge } from "./OccupancyBadge";

type PropertyCardProps = {
  property: PropertySummary;
};

const TYPE_COLORS: Record<PropertySummary["type"], string> = {
  apartment: "from-indigo-500 to-violet-500",
  house: "from-emerald-500 to-teal-500",
  condo: "from-blue-500 to-cyan-500",
  commercial: "from-amber-500 to-orange-500",
};

export function PropertyCard({ property }: PropertyCardProps) {
  const gradient = TYPE_COLORS[property.type] ?? "from-slate-500 to-slate-600";

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-0.5">
        {/* Colored header strip */}
        <div className={`bg-gradient-to-r ${gradient} h-1.5 w-full`} />

        <CardContent className="pt-4 px-4 space-y-4">
          {/* Name + badge row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {PROPERTY_TYPE_LABELS[property.type]}
                </span>
              </div>
              <h3 className="font-semibold text-base leading-tight truncate group-hover:text-primary transition-colors">
                {property.name}
              </h3>
            </div>
            <OccupancyBadge rate={property.occupancyRate} />
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
            <span className="truncate">
              {property.street}, {property.city}, {property.state} {property.zip}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Stats row */}
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <dt className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                <Home className="h-3 w-3" />
                Units
              </dt>
              <dd className="font-bold text-base">{property.unitCount}</dd>
            </div>
            <div className="text-center border-x">
              <dt className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                <Building2 className="h-3 w-3" />
                Occupied
              </dt>
              <dd className="font-bold text-base">{property.occupiedUnits}</dd>
            </div>
            <div className="text-center">
              <dt className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                <DollarSign className="h-3 w-3" />
                /mo
              </dt>
              <dd className="font-bold text-base">{formatCurrency(property.monthlyRevenue)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </Link>
  );
}
