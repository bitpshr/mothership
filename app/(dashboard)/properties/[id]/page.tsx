import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Home, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPropertyById } from "@/db/queries/properties";
import { getUnitsByPropertyId } from "@/db/queries/units";
import { getMaintenanceByPropertyId } from "@/db/queries/maintenance";
import { UnitsList } from "@/components/property-detail/UnitsList";
import { PropertyFinancials } from "@/components/property-detail/PropertyFinancials";
import { PropertyMaintenance } from "@/components/property-detail/PropertyMaintenance";
import { PropertyDetailActions } from "@/components/property-detail/PropertyDetailActions";
import { PROPERTY_TYPE_LABELS } from "@/lib/constants";
import type { Property } from "@/db/schema";

type PageProps = {
  params: Promise<{ id: string }>;
};

const TYPE_GRADIENT: Record<Property["type"], string> = {
  apartment: "from-indigo-500 to-violet-500",
  house: "from-emerald-500 to-teal-500",
  condo: "from-blue-500 to-cyan-500",
  commercial: "from-amber-500 to-orange-500",
};

const TYPE_BADGE: Record<Property["type"], string> = {
  apartment: "border-indigo-200 bg-indigo-100 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400",
  house: "border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400",
  condo: "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/40 dark:text-blue-400",
  commercial: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/40 dark:text-amber-400",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyById(id);
  return { title: property?.name ?? "Property" };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [property, units, maintenance] = await Promise.all([
    getPropertyById(id),
    getUnitsByPropertyId(id),
    getMaintenanceByPropertyId(id),
  ]);

  if (!property) notFound();

  const address = `${property.street}, ${property.city}, ${property.state} ${property.zip}`;
  const openRequests = maintenance.filter(
    (r) => r.status === "open" || r.status === "in_progress",
  ).length;
  const occupiedCount = units.filter((u) => u.status === "occupied").length;
  const gradient = TYPE_GRADIENT[property.type];
  const typeBadgeClass = TYPE_BADGE[property.type];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Hero card */}
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
        <div className="p-5">
          <div className="flex items-start gap-3">
            <Button variant="ghost" size="icon" asChild className="-ml-1.5 -mt-0.5 shrink-0">
              <Link href="/properties">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div className="flex-1 min-w-0">
              {/* Title + badges + actions */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-semibold tracking-tight">{property.name}</h1>
                  <Badge className={typeBadgeClass}>
                    {PROPERTY_TYPE_LABELS[property.type]}
                  </Badge>
                  {openRequests > 0 && (
                    <Badge className="border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-400">
                      {openRequests} open {openRequests === 1 ? "request" : "requests"}
                    </Badge>
                  )}
                </div>
                <PropertyDetailActions property={property} />
              </div>

              {/* Address */}
              <div className="flex items-center gap-1.5 mt-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{address}</span>
              </div>

              {/* Meta chips */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant="secondary">
                  <Home />{units.length} units
                </Badge>
                <Badge variant="secondary">
                  <Calendar />Built {property.yearBuilt}
                </Badge>
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {occupiedCount} of {units.length} occupied
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="units">
        <TabsList>
          <TabsTrigger value="units">Units ({units.length})</TabsTrigger>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance ({maintenance.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="mt-6">
          <UnitsList units={units} />
        </TabsContent>

        <TabsContent value="financials" className="mt-6">
          <PropertyFinancials units={units} />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <PropertyMaintenance requests={maintenance} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
