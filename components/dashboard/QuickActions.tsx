"use client";

import { useState } from "react";
import { Building2, ChevronDown, Plus, UserPlus, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddPropertyModal } from "@/components/properties/AddPropertyModal";
import { AddTenantModal } from "@/components/tenants/AddTenantModal";
import { AddMaintenanceModal } from "@/components/maintenance/AddMaintenanceModal";
import type { Property, Unit, Tenant } from "@/db/schema";

type QuickActionsProps = {
  properties: Property[];
  vacantUnits: Unit[];
  occupiedUnits: Unit[];
  tenants: Tenant[];
};

type Modal = "property" | "tenant" | "maintenance" | null;

export function QuickActions({
  properties,
  vacantUnits,
  occupiedUnits,
  tenants,
}: QuickActionsProps) {
  const [openModal, setOpenModal] = useState<Modal>(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Quick Add</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenModal("property")}>
            <Building2 className="mr-2 h-4 w-4" />
            Property
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenModal("tenant")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Tenant
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenModal("maintenance")}>
            <Wrench className="mr-2 h-4 w-4" />
            Request
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddPropertyModal
        open={openModal === "property"}
        onOpenChange={(v) => setOpenModal(v ? "property" : null)}
      />
      <AddTenantModal
        properties={properties}
        vacantUnits={vacantUnits}
        open={openModal === "tenant"}
        onOpenChange={(v) => setOpenModal(v ? "tenant" : null)}
      />
      <AddMaintenanceModal
        properties={properties}
        occupiedUnits={occupiedUnits}
        tenants={tenants}
        open={openModal === "maintenance"}
        onOpenChange={(v) => setOpenModal(v ? "maintenance" : null)}
      />
    </>
  );
}
