"use client";

import { useState } from "react";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MaintenanceForm } from "./MaintenanceForm";
import { createMaintenanceRequest } from "@/actions/maintenance";
import type { MaintenanceRequestFormValues } from "@/lib/schemas";
import type { Property, Unit, Tenant } from "@/db/schema";

type AddMaintenanceModalProps = {
  properties: Property[];
  occupiedUnits: Unit[];
  tenants: Tenant[];
  /** When provided, renders as a controlled dialog (no trigger button) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddMaintenanceModal({
  properties,
  occupiedUnits,
  tenants,
  open: controlledOpen,
  onOpenChange,
}: AddMaintenanceModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? setInternalOpen) : setInternalOpen;

  async function handleSubmit(values: MaintenanceRequestFormValues) {
    await createMaintenanceRequest(values);
    setOpen(false);
    toast.success("Request submitted", { description: `"${values.title}" has been logged.` });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Wrench className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Maintenance Request</DialogTitle>
          <DialogDescription>
            Log a new maintenance issue for a unit in your portfolio.
          </DialogDescription>
        </DialogHeader>
        <MaintenanceForm
          properties={properties}
          occupiedUnits={occupiedUnits}
          tenants={tenants}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
