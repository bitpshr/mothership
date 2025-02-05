"use client";

import { useEffect, useState } from "react";
import { Bell, Lock, Palette, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STORAGE_KEY = "mothership:settings";

type Settings = {
  displayName: string;
  email: string;
  company: string;
  timezone: string;
  dateFormat: string;
  currencySymbol: string;
  notifyLeaseExpiry: boolean;
  notifyMaintenance: boolean;
  notifyPayments: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  displayName: "",
  email: "",
  company: "",
  timezone: "America/New_York",
  dateFormat: "MMM d, yyyy",
  currencySymbol: "USD",
  notifyLeaseExpiry: true,
  notifyMaintenance: true,
  notifyPayments: false,
};

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage full or unavailable (e.g. private browsing)
  }
}

type SectionId = "profile" | "account" | "preferences" | "notifications";

const SECTIONS: { id: SectionId; label: string; icon: React.ComponentType<{ className?: string }> }[] =
  [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("profile");

  /* eslint-disable react-hooks/set-state-in-effect -- hydration guard for localStorage */
  useEffect(() => {
    setSettings(loadSettings());
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    saveSettings(settings);
    toast.success("Settings saved");
  }

  if (!mounted) return null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </div>

      <div className="flex gap-8">
        {/* Left nav */}
        <nav className="w-44 shrink-0">
          <ul className="space-y-0.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  onClick={() => setActiveSection(id)}
                  className={cn(
                    "relative w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors text-left",
                    activeSection === id
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  {activeSection === id && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-primary" />
                  )}
                  <Icon className="size-4 shrink-0" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <Separator orientation="vertical" className="h-auto" />

        {/* Content */}
        <div className="flex-1 max-w-xl space-y-6">
          {activeSection === "profile" && (
            <>
              <div>
                <h2 className="text-base font-semibold">Profile</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Update your personal info and contact details.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input
                      id="displayName"
                      placeholder="Jane Smith"
                      value={settings.displayName}
                      onChange={(e) => update("displayName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      placeholder="Smith Properties LLC"
                      value={settings.company}
                      onChange={(e) => update("company", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={settings.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Save changes</Button>
            </>
          )}

          {activeSection === "account" && (
            <>
              <div>
                <h2 className="text-base font-semibold">Account</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Manage your login credentials and account security.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="flex gap-2">
                  <Input type="password" value="••••••••••••" readOnly className="flex-1" />
                  <Button variant="outline" disabled>
                    Change
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password management coming in a future release.
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-destructive">Danger zone</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all portfolio data. This cannot be undone.
                </p>
                <Button variant="destructive" size="sm" disabled className="mt-1">
                  Delete account
                </Button>
              </div>
            </>
          )}

          {activeSection === "preferences" && (
            <>
              <div>
                <h2 className="text-base font-semibold">Preferences</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Control how dates, times, and currency are displayed.
                </p>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.timezone}
                    onValueChange={(v) => update("timezone", v)}
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                      <SelectItem value="Pacific/Honolulu">Hawaii Time (HT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Central European (CET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date format</Label>
                  <Select
                    value={settings.dateFormat}
                    onValueChange={(v) => update("dateFormat", v)}
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MMM d, yyyy">Jan 1, 2025</SelectItem>
                      <SelectItem value="MM/dd/yyyy">01/01/2025</SelectItem>
                      <SelectItem value="dd/MM/yyyy">01/01/2025 (EU)</SelectItem>
                      <SelectItem value="yyyy-MM-dd">2025-01-01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Display currency</Label>
                  <Select
                    value={settings.currencySymbol}
                    onValueChange={(v) => update("currencySymbol", v)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">EUR — Euro (€)</SelectItem>
                      <SelectItem value="GBP">GBP — British Pound (£)</SelectItem>
                      <SelectItem value="CAD">CAD — Canadian Dollar (CA$)</SelectItem>
                      <SelectItem value="AUD">AUD — Australian Dollar (A$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleSave}>Save changes</Button>
            </>
          )}

          {activeSection === "notifications" && (
            <>
              <div>
                <h2 className="text-base font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Choose which events trigger in-app alerts.
                </p>
              </div>
              <Separator />
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyLeaseExpiry" className="text-sm font-medium cursor-pointer">
                      Lease expiry reminders
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerted when a lease is expiring within 60 days.
                    </p>
                  </div>
                  <Switch
                    id="notifyLeaseExpiry"
                    checked={settings.notifyLeaseExpiry}
                    onCheckedChange={(v) => update("notifyLeaseExpiry", v)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyMaintenance" className="text-sm font-medium cursor-pointer">
                      Maintenance updates
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerted when a maintenance request changes status.
                    </p>
                  </div>
                  <Switch
                    id="notifyMaintenance"
                    checked={settings.notifyMaintenance}
                    onCheckedChange={(v) => update("notifyMaintenance", v)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyPayments" className="text-sm font-medium cursor-pointer">
                      Payment confirmations
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get alerted when a rent payment is recorded.
                    </p>
                  </div>
                  <Switch
                    id="notifyPayments"
                    checked={settings.notifyPayments}
                    onCheckedChange={(v) => update("notifyPayments", v)}
                  />
                </div>
              </div>
              <Button onClick={handleSave}>Save changes</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
