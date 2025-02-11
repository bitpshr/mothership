import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PropertyForm } from "@/components/properties/PropertyForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => "/properties",
}));

describe("PropertyForm", () => {
  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<PropertyForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /add property/i }));

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit with correct values for valid input", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<PropertyForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/property name/i), "Test Building");
    await user.clear(screen.getByLabelText(/street address/i));
    await user.type(screen.getByLabelText(/street address/i), "123 Main Street");
    await user.type(screen.getByLabelText(/city/i), "Portland");
    await user.type(screen.getByLabelText(/state/i), "OR");
    await user.type(screen.getByLabelText(/zip/i), "97201");

    await user.click(screen.getByRole("button", { name: /add property/i }));

    await waitFor(() => {
      // RHF calls onSubmit(data, event) — use expect.anything() for the event
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Test Building",
          city: "Portland",
          state: "OR",
          zip: "97201",
        }),
        expect.anything(),
      );
    });
  });

  it("pre-populates fields in edit mode", () => {
    const onSubmit = vi.fn();
    render(
      <PropertyForm
        onSubmit={onSubmit}
        isEditing
        defaultValues={{ name: "Sunset Arms", city: "Los Angeles" }}
      />,
    );

    expect(screen.getByDisplayValue("Sunset Arms")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Los Angeles")).toBeInTheDocument();
  });

  it("shows 'Save Changes' button text in edit mode", () => {
    render(<PropertyForm onSubmit={vi.fn()} isEditing />);
    expect(screen.getByRole("button", { name: /save changes/i })).toBeInTheDocument();
  });
});
