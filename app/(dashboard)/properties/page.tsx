import type { Metadata } from "next";
import { Building2, DollarSign, TrendingUp } from "lucide-react";
import { getPropertySummaries } from "@/db/queries/properties";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { AddPropertyModal } from "@/components/properties/AddPropertyModal";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatOccupancy } from "@/lib/formatters";

export const metadata: Metadata = { title: "PROPERTIES" };

export default async function PropertiesPage() {
  const properties = await getPropertySummaries();

  const totalUnits = properties.reduce((s, p) => s + p.unitCount, 0);
  const totalOccupied = properties.reduce((s, p) => s + p.occupiedUnits, 0);
  const totalRevenue = properties.reduce((s, p) => s + p.monthlyRevenue, 0);
  const occupancyRate = totalUnits > 0 ? totalOccupied / totalUnits : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Properties</h1>
          <p className="text-sm text-muted-foreground">
            {properties.length} {properties.length === 1 ? "property" : "properties"} in your portfolio
          </p>
          {properties.length > 0 && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <Badge variant="secondary">
                <Building2 />{totalUnits} total units
              </Badge>
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                <TrendingUp />{formatOccupancy(occupancyRate)} occupied
              </Badge>
              <Badge className="border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-400">
                <DollarSign />{formatCurrency(totalRevenue)}/mo
              </Badge>
            </div>
          )}
        </div>
        <AddPropertyModal />
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground">No properties yet.</p>
          <p className="text-sm text-muted-foreground">Add your first property to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
