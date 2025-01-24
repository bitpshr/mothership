"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { PropertyForm } from "./PropertyForm";
import { createProperty } from "@/actions/properties";
import type { PropertyFormValues } from "@/lib/schemas";

type AddPropertyModalProps = {
  /** When provided, renders as a controlled dialog (no trigger button) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AddPropertyModal({ open: controlledOpen, onOpenChange }: AddPropertyModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onOpenChange ?? setInternalOpen) : setInternalOpen;

  async function handleSubmit(values: PropertyFormValues) {
    await createProperty(values);
    setOpen(false);
    toast.success("Property added", { description: `"${values.name}" is now in your portfolio.` });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Property</DialogTitle>
          <DialogDescription>
            Add a new property to your portfolio. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <PropertyForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
