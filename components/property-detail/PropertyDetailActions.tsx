"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { updateProperty, deleteProperty } from "@/actions/properties";
import type { Property } from "@/db/schema";
import type { PropertyFormValues } from "@/lib/schemas";

type Props = {
  property: Property;
};

export function PropertyDetailActions({ property }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleUpdate(values: PropertyFormValues) {
    await updateProperty(property.id, values);
    setEditOpen(false);
    toast.success("Property updated", {
      description: `"${values.name}" has been saved.`,
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteProperty(property.id);
      toast.success("Property deleted", {
        description: `"${property.name}" has been removed from your portfolio.`,
      });
      router.push("/properties");
    });
  }

  return (
    <>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-1.5 size-3.5" />
          Edit
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isPending}>
              <Trash2 className="mr-1.5 size-3.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete property?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete <strong>{property.name}</strong> and all associated
                units, tenants, and maintenance requests. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={handleDelete}
              >
                Delete Property
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
            <DialogDescription>
              Update the details for {property.name}.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm
            defaultValues={{
              name: property.name,
              type: property.type,
              street: property.street,
              city: property.city,
              state: property.state,
              zip: property.zip,
              unitCount: property.unitCount,
              yearBuilt: property.yearBuilt,
            }}
            onSubmit={handleUpdate}
            isEditing
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
