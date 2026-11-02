import React, { useEffect, useState } from "react";
import { Bell, Check, RotateCcw, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  lowStockThreshold: 10,
  safeStockDays: 14,
  alertRefreshMinutes: 5,
  notificationSound: true,
  currency: "INR",
  theme: "light",
};

const SETTINGS_KEY = "cartify-store-settings";

const StoreSettings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
      const loadedSettings = saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
      setSettings(loadedSettings);
      document.documentElement.classList.toggle("dark", loadedSettings.theme === "dark");
      document.documentElement.dataset.theme = loadedSettings.theme;
    } catch {
      localStorage.removeItem(SETTINGS_KEY);
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
    if (key === "theme") {
      document.documentElement.classList.toggle("dark", value === "dark");
      document.documentElement.dataset.theme = value;
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent("cartify-settings-updated", { detail: settings }));
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved");
    }, 250);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.theme = "light";
    toast.success("Settings reset to defaults");
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <SettingsIcon className="text-green-600" /> Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure POS alerts, stock planning, and display preferences.
        </p>
      </div>

      <Card>
        <CardHeader><CardTitle>Inventory alerts</CardTitle></CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="low-stock">Low-stock threshold</Label>
            <Input id="low-stock" type="number" min="0" value={settings.lowStockThreshold} onChange={(event) => updateSetting("lowStockThreshold", Number(event.target.value))} />
            <p className="text-xs text-gray-500">Products at or below this quantity need attention.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="safe-days">Safe-stock coverage (days)</Label>
            <Input id="safe-days" type="number" min="1" value={settings.safeStockDays} onChange={(event) => updateSetting("safeStockDays", Number(event.target.value))} />
            <p className="text-xs text-gray-500">Target stock coverage based on recent sales.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="refresh-minutes">Alert refresh interval (minutes)</Label>
            <Input id="refresh-minutes" type="number" min="1" value={settings.alertRefreshMinutes} onChange={(event) => updateSetting("alertRefreshMinutes", Number(event.target.value))} />
            <p className="text-xs text-gray-500">Used as the preferred refresh interval for alerts.</p>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="flex items-center gap-3"><Bell className="h-5 w-5 text-green-600" /><div><Label htmlFor="sound">Notification sound</Label><p className="text-xs text-gray-500">Play a sound for critical stock alerts.</p></div></div>
            <Switch id="sound" checked={settings.notificationSound} onCheckedChange={(checked) => updateSetting("notificationSound", checked)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>POS preferences</CardTitle></CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="currency">Currency</Label><select id="currency" value={settings.currency} onChange={(event) => updateSetting("currency", event.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="INR">INR (₹)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div>
          <div className="space-y-2"><Label htmlFor="theme">Theme</Label><select id="theme" value={settings.theme} onChange={(event) => updateSetting("theme", event.target.value)} className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"><option value="light">White + Green</option><option value="red">Red Operations</option><option value="dark">Dark Operations</option></select><p className="text-xs text-gray-500">Applies across the complete POS workspace.</p></div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleReset}><RotateCcw className="mr-2 h-4 w-4" />Reset</Button>
        <Button onClick={handleSave} disabled={isSaving}><Check className="mr-2 h-4 w-4" />{isSaving ? "Saving..." : "Save Settings"}</Button>
      </div>
    </div>
  );
};

export default StoreSettings;