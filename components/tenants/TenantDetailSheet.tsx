"use client";

import { useState, useTransition } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { Building2, Calendar, DollarSign, Mail, Phone, Pencil, Trash2, Wrench } from "lucide-react";
import type { TenantWithLeaseStatus } from "@/db/schema";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { deleteTenant } from "@/actions/tenants";
import { LeaseStatusBadge } from "./LeaseStatusBadge";
import { EditTenantModal } from "./EditTenantModal";

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-blue-500 to-cyan-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-violet-500 to-purple-500",
  "from-teal-500 to-emerald-500",
];

function avatarGradient(name: string): string {
  const sum = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

type Props = {
  tenant: TenantWithLeaseStatus | null;
  open: boolean;
  onClose: () => void;
};

export function TenantDetailSheet({ tenant, open, onClose }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!tenant) return;
    startTransition(async () => {
      await deleteTenant(tenant.id);
      onClose();
      toast.success("Tenant removed", {
        description: `${tenant.firstName} ${tenant.lastName} has been removed and their unit freed.`,
      });
    });
  }

  if (!tenant) return null;

  const initials = `${tenant.firstName.charAt(0)}${tenant.lastName.charAt(0)}`.toUpperCase();
  const gradient = avatarGradient(`${tenant.firstName}${tenant.lastName}`);
  const fullName = `${tenant.firstName} ${tenant.lastName}`;

  return (
    <>
      <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-0">
            <SheetTitle className="sr-only">{fullName}</SheetTitle>
            <SheetDescription className="sr-only">Details for {fullName}</SheetDescription>
          </SheetHeader>

          <div className="space-y-6 px-6 pt-2 pb-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <div
                className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white text-xl font-bold select-none shadow-md`}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold leading-tight">{fullName}</h2>
                <div className="mt-1">
                  <LeaseStatusBadge status={tenant.leaseStatus} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contact</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-sm">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" />
                  <span>{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="size-3.5 shrink-0 text-muted-foreground" />
                  <span>{tenant.phone}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Property */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Property</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-sm">
                  <Building2 className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="font-medium">{tenant.propertyName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm">
                  <Wrench className="size-3.5 shrink-0 text-muted-foreground" />
                  <span>Unit {tenant.unitNumber}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Lease */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Lease</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    <Calendar className="size-3" />
                    Start
                  </div>
                  <p className="text-sm font-semibold">{formatDate(tenant.leaseStart)}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    <Calendar className="size-3" />
                    End
                  </div>
                  <p className="text-sm font-semibold">{formatDate(tenant.leaseEnd)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Financials */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Financials</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    <DollarSign className="size-3" />
                    Monthly Rent
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(tenant.monthlyRent)}</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
                    <DollarSign className="size-3" />
                    Deposit
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(tenant.securityDeposit)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => setEditOpen(true)}
              >
                <Pencil className="mr-2 size-3.5" />
                Edit Tenant
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" disabled={isPending}>
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove tenant?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove <strong>{fullName}</strong> and mark their unit
                      as vacant. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                    >
                      Remove Tenant
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <EditTenantModal
        tenant={tenant}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onClose}
      />
    </>
  );
}
