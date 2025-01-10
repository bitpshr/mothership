import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["apartment", "house", "condo", "commercial"]),
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().length(2, "Use a 2-letter state code"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Enter a valid ZIP code"),
  // z.number() + valueAsNumber on the input avoids z.coerce input type mismatch with RHF
  unitCount: z.number().int().min(1, "Must have at least 1 unit"),
  yearBuilt: z
    .number()
    .int()
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const tenantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  propertyId: z.string().min(1, "Select a property"),
  unitId: z.string().min(1, "Select a unit"),
  leaseStart: z.string().min(1, "Lease start date is required"),
  leaseEnd: z.string().min(1, "Lease end date is required"),
  // Collected in dollars, converted to cents in the action
  monthlyRent: z.number().int().min(1, "Enter monthly rent in whole dollars"),
  securityDeposit: z.number().int().min(0, "Enter security deposit in whole dollars"),
});

export type TenantFormValues = z.infer<typeof tenantSchema>;

// Edit-only schema — propertyId/unitId are fixed after creation
export const updateTenantSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  leaseStart: z.string().min(1, "Lease start date is required"),
  leaseEnd: z.string().min(1, "Lease end date is required"),
  monthlyRent: z.number().int().min(1, "Enter monthly rent in whole dollars"),
  securityDeposit: z.number().int().min(0, "Enter security deposit in whole dollars"),
});

export type UpdateTenantFormValues = z.infer<typeof updateTenantSchema>;

export const maintenanceRequestSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Please provide more detail"),
  priority: z.enum(["low", "medium", "high", "emergency"]),
  propertyId: z.string().min(1, "Select a property"),
  unitId: z.string().min(1, "Select a unit"),
  tenantId: z.string().min(1, "Select a tenant"),
});

export type MaintenanceRequestFormValues = z.infer<typeof maintenanceRequestSchema>;
