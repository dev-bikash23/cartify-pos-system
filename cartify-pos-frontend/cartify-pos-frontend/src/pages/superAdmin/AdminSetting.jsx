import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateUserProfile } from "@/Redux Toolkit/features/User/userThunk";

const SETTINGS_KEY = "cartify-admin-settings";
const defaultSettings = { theme: "light", dateFormat: "en-US", pageSize: "10", notifications: true };

const AdminSetting = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [password, setPassword] = useState({ value: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState("");
  const dispatch = useDispatch();
  const { userProfile, loading } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "null");
      if (stored) setSettings({ ...defaultSettings, ...stored });
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const updateSetting = (key, value) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    if (key === "theme") {
      document.documentElement.classList.toggle("dark", value === "dark");
      document.documentElement.dataset.theme = value;
      window.dispatchEvent(new CustomEvent("cartify-settings-updated", { detail: next }));
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    if (password.value.length < 6) {
      setPasswordMessage("Password must contain at least 6 characters.");
      return;
    }
    if (password.value !== password.confirm) {
      setPasswordMessage("Passwords do not match.");
      return;
    }
    try {
      await dispatch(updateUserProfile({
        id: userProfile.id,
        userData: { password: password.value, role: userProfile.role },
      })).unwrap();
      setPassword({ value: "", confirm: "" });
      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      setPasswordMessage(error || "Unable to change password.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure preferences for this administrator session.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Display preferences</CardTitle></CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <p className="mt-1 text-xs text-muted-foreground">Choose the appearance for every workspace.</p>
            <select id="theme" value={settings.theme} onChange={(event) => updateSetting("theme", event.target.value)} className="mt-2 h-10 w-full rounded-lg border bg-background px-3 text-sm font-medium">
              <option value="light">Light</option><option value="red">Red</option><option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <Label htmlFor="dateFormat">Date format</Label>
            <select id="dateFormat" value={settings.dateFormat} onChange={(event) => updateSetting("dateFormat", event.target.value)} className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="en-US">MM/DD/YYYY</option><option value="en-GB">DD/MM/YYYY</option>
            </select>
          </div>
          <div>
            <Label htmlFor="pageSize">Rows per page</Label>
            <select id="pageSize" value={settings.pageSize} onChange={(event) => updateSetting("pageSize", event.target.value)} className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm">
              <option value="10">10</option><option value="25">25</option><option value="50">50</option>
            </select>
          </div>
          <label className="flex items-center gap-3 self-end text-sm">
            <input id="notifications" type="checkbox" checked={settings.notifications} onChange={(event) => updateSetting("notifications", event.target.checked)} />
            Enable administrator notifications
          </label>
          {saved && <p className="self-end text-sm text-green-700">Preferences saved.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Security</CardTitle></CardHeader>
        <CardContent>
          {passwordMessage && <p className="mb-4 text-sm text-green-700">{passwordMessage}</p>}
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={changePassword}>
            <div><Label htmlFor="settingsNewPassword">New password</Label><input id="settingsNewPassword" type="password" minLength={6} required value={password.value} onChange={(event) => setPassword({ ...password, value: event.target.value })} className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" /></div>
            <div><Label htmlFor="settingsConfirmPassword">Confirm password</Label><input id="settingsConfirmPassword" type="password" minLength={6} required value={password.confirm} onChange={(event) => setPassword({ ...password, confirm: event.target.value })} className="mt-1 h-9 w-full rounded-md border bg-background px-3 text-sm" /></div>
            <div className="sm:col-span-2"><Button type="submit" disabled={loading || !userProfile}>{loading ? "Updating..." : "Change password"}</Button></div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetting;
