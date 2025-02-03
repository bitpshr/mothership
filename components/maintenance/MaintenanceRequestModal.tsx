"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { updateRequestStatus, updateRequestNotes, deleteMaintenanceRequest } from "@/actions/maintenance";
import type { MaintenanceRequestWithContext } from "@/db/queries/maintenance";
import type { MaintenanceRequest } from "@/db/schema";
import { formatDate } from "@/lib/formatters";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";
import { Building2, Calendar, Clock, Trash2, User, Wrench } from "lucide-react";
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

type Props = {
  request: MaintenanceRequestWithContext | null;
  open: boolean;
  onClose: () => void;
};

type StatusTransition = {
  label: string;
  status: MaintenanceRequest["status"];
  variant: "default" | "outline" | "destructive" | "secondary";
};

function getAvailableTransitions(status: MaintenanceRequest["status"]): StatusTransition[] {
  switch (status) {
    case "open":
      return [
        { label: "Start work", status: "in_progress", variant: "default" },
        { label: "Close", status: "closed", variant: "outline" },
      ];
    case "in_progress":
      return [
        { label: "Resolve", status: "resolved", variant: "default" },
        { label: "Cancel", status: "closed", variant: "destructive" },
      ];
    case "resolved":
      return [
        { label: "Close", status: "closed", variant: "outline" },
        { label: "Reopen", status: "open", variant: "secondary" },
      ];
    case "closed":
      return [{ label: "Reopen", status: "open", variant: "secondary" }];
    default:
      return [];
  }
}

export function MaintenanceRequestModal({ request, open, onClose }: Props) {
  const [notes, setNotes] = useState(request?.notes ?? "");
  const [notesSaved, setNotesSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sync notes field when a different request is opened
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps -- intentional reset on request change */
  useEffect(() => {
    setNotes(request?.notes ?? "");
    setNotesSaved(false);
  }, [request?.id]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  function handleStatusChange(status: MaintenanceRequest["status"], label: string) {
    if (!request) return;
    startTransition(async () => {
      await updateRequestStatus(request.id, status);
      onClose();
      toast.success(`Request ${label.toLowerCase()}`, {
        description: `"${request.title}" status updated.`,
      });
    });
  }

  function handleDelete() {
    if (!request) return;
    startTransition(async () => {
      await deleteMaintenanceRequest(request.id);
      onClose();
      toast.success("Request deleted", {
        description: `"${request.title}" has been permanently removed.`,
      });
    });
  }

  function handleSaveNotes() {
    if (!request) return;
    startTransition(async () => {
      await updateRequestNotes(request.id, notes);
      setNotesSaved(true);
      toast.success("Notes saved");
    });
  }

  // Reset "Notes saved" indicator after 2 seconds
  useEffect(() => {
    if (!notesSaved) return;
    const timer = setTimeout(() => setNotesSaved(false), 2000);
    return () => clearTimeout(timer);
  }, [notesSaved]);

  if (!request) return null;

  const transitions = getAvailableTransitions(request.status);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-6 text-base leading-snug">{request.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status + priority row */}
          <div className="flex items-center gap-2">
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>

          {/* Description */}
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">{request.description}</DialogDescription>

          <Separator />

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="size-3.5 shrink-0" />
              <span>Property</span>
            </div>
            <span className="font-medium">{request.propertyName}</span>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Wrench className="size-3.5 shrink-0" />
              <span>Unit</span>
            </div>
            <span className="font-medium">Unit {request.unitNumber}</span>

            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-3.5 shrink-0" />
              <span>Reported by</span>
            </div>
            <span className="font-medium">{request.tenantName}</span>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-3.5 shrink-0" />
              <span>Opened</span>
            </div>
            <span className="font-medium">{formatDate(request.createdAt)}</span>

            {request.resolvedAt && (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="size-3.5 shrink-0" />
                  <span>Resolved</span>
                </div>
                <span className="font-medium">{formatDate(request.resolvedAt)}</span>
              </>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Internal notes</p>
            <Textarea
              placeholder="Add notes for your records…"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesSaved(false);
              }}
              rows={4}
              className="resize-none text-sm"
            />
            <div className="flex items-center justify-end gap-2">
              {notesSaved && (
                <span className="text-xs text-muted-foreground animate-in fade-in">
                  Notes saved.
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveNotes}
                disabled={isPending || notes === (request.notes ?? "")}
              >
                Save notes
              </Button>
            </div>
          </div>

          {/* Status transitions + delete */}
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Actions</p>
            <div className="flex flex-wrap items-center gap-2">
              {transitions.map((t) => (
                <Button
                  key={t.status}
                  size="sm"
                  variant={t.variant}
                  disabled={isPending}
                  onClick={() => handleStatusChange(t.status, t.label)}
                >
                  {t.label}
                </Button>
              ))}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" disabled={isPending} className="ml-auto text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="mr-1.5 size-3.5" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete request?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete <strong>{request.title}</strong>. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                    >
                      Delete Request
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
