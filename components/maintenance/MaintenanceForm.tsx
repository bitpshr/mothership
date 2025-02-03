"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { maintenanceRequestSchema, type MaintenanceRequestFormValues } from "@/lib/schemas";
import type { Property, Unit, Tenant } from "@/db/schema";

type MaintenanceFormProps = {
  properties: Property[];
  /** Only occupied units (those with a tenant) */
  occupiedUnits: Unit[];
  tenants: Tenant[];
  onSubmit: (values: MaintenanceRequestFormValues) => Promise<void>;
};

export function MaintenanceForm({
  properties,
  occupiedUnits,
  tenants,
  onSubmit,
}: MaintenanceFormProps) {
  const form = useForm<MaintenanceRequestFormValues>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      propertyId: "",
      unitId: "",
      tenantId: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch is safe here
  const selectedPropertyId = form.watch("propertyId");
  const selectedUnitId = form.watch("unitId");

  const filteredUnits = occupiedUnits.filter((u) => u.propertyId === selectedPropertyId);
  const unitTenant = tenants.find((t) => t.unitId === selectedUnitId);

  // Clear unit + tenant when property changes
  useEffect(() => {
    form.setValue("unitId", "");
    form.setValue("tenantId", "");
  }, [selectedPropertyId, form]);

  // Auto-set tenant when unit is chosen
  useEffect(() => {
    if (unitTenant) {
      form.setValue("tenantId", unitTenant.id);
    } else {
      form.setValue("tenantId", "");
    }
  }, [selectedUnitId, unitTenant, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue Title</FormLabel>
              <FormControl>
                <Input placeholder="Leaking faucet in bathroom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail…"
                  rows={3}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unitId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedPropertyId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        selectedPropertyId ? "Select a unit" : "Select a property first"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredUnits.length === 0 ? (
                    <SelectItem value="__none" disabled>
                      No occupied units
                    </SelectItem>
                  ) : (
                    filteredUnits.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        Unit {u.unitNumber}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tenant is auto-resolved from the unit — show as read-only */}
        {selectedUnitId && (
          <div className="rounded-md bg-muted px-3 py-2 text-sm">
            <span className="text-muted-foreground">Tenant: </span>
            <span className="font-medium">
              {unitTenant
                ? `${unitTenant.firstName} ${unitTenant.lastName}`
                : "No tenant found for this unit"}
            </span>
          </div>
        )}

        {/* Hidden field to carry tenantId through validation */}
        <input type="hidden" {...form.register("tenantId")} />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting…" : "Submit Request"}
        </Button>
      </form>
    </Form>
  );
}
