"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
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
import { TenantForm } from "./TenantForm";
import { createTenant } from "@/actions/tenants";
import type { TenantFormValues } from "@/lib/schemas";
import type { Property, Unit } from "@/db/schema";

type AddTenantModalProps = {
  properties: Property[];
  vacantUnits: Unit[];
  /** When true, renders only the dialog (no trigger button) — controlled from outside */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddTenantModal({
  properties,
  vacantUnits,
  open: controlledOpen,
  onOpenChange,
}: AddTenantModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? setInternalOpen) : setInternalOpen;

  async function handleSubmit(values: TenantFormValues) {
    await createTenant(values);
    setOpen(false);
    toast.success("Tenant added", {
      description: `${values.firstName} ${values.lastName} has been added.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Tenant</DialogTitle>
          <DialogDescription>
            Assign a tenant to a vacant unit and set up their lease details.
          </DialogDescription>
        </DialogHeader>
        <TenantForm
          properties={properties}
          vacantUnits={vacantUnits}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
