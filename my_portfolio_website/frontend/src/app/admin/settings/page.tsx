"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  KeyRound,
  Moon,
  Palette,
  Power,
  RefreshCw,
  Save,
  Shield,
  Sliders,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { adminFetch } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme/theme-provider";

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<SiteSettings>({
    id: "",
    defaultTheme: "jarvis",
    contactEnabled: true,
    requestsEnabled: true,
    maintenanceMode: false,
    updatedAt: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password / Secret Info
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hashResult, setHashResult] = useState<string | null>(null);

  async function loadSettings() {
    setLoading(true);
    try {
      const data = await adminFetch<SiteSettings>("/admin/settings");
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  async function saveSettings(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const updated = await adminFetch<SiteSettings>("/admin/settings", {
        method: "PUT",
        body: JSON.stringify({
          defaultTheme: settings.defaultTheme,
          contactEnabled: settings.contactEnabled,
          requestsEnabled: settings.requestsEnabled,
          maintenanceMode: settings.maintenanceMode,
        }),
      });
      setSettings(updated);
      setSuccessMsg("Platform settings saved successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Platform Settings & Controls
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            Configure default aesthetics, intake pipeline availability, and security credentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={loadSettings}
            disabled={loading}
            className="font-mono text-xs"
          >
            <RefreshCw size={13} className={cn("mr-1.5", loading && "animate-spin")} />
            Reload
          </Button>

          <Button
            size="sm"
            onClick={() => saveSettings()}
            disabled={saving}
            className="bg-cyan text-slate-950 hover:bg-cyan-soft font-mono text-xs font-semibold"
          >
            <Save size={13} className="mr-1.5" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-lg">
          <Check size={14} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-mono text-signal-red bg-signal-red/10 border border-signal-red/30 p-3 rounded-lg">
          <AlertCircle size={14} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Aesthetic / Theme System */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Palette className="text-cyan" size={18} />
            <h2 className="text-base font-display">Theme & Aesthetic Configuration</h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            The platform supports two signature operating modes: Jarvis (deep space dark cyan) and
            Ember (warm obsidian titanium amber). Choose the default theme for first-time public visitors.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSettings({ ...settings, defaultTheme: "jarvis" });
                setTheme("jarvis");
              }}
              className={cn(
                "flex flex-col items-start p-4 rounded-xl border text-left transition-all",
                settings.defaultTheme === "jarvis"
                  ? "border-cyan bg-cyan/10 ring-1 ring-cyan"
                  : "border-border bg-surface-2/40 hover:bg-surface-2"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold text-cyan">JARVIS</span>
                <span className="h-3 w-3 rounded-full bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-2">
                Deep obsidian, neon cyan accents, futuristic terminal aesthetic.
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSettings({ ...settings, defaultTheme: "ember" });
                setTheme("ember");
              }}
              className={cn(
                "flex flex-col items-start p-4 rounded-xl border text-left transition-all",
                settings.defaultTheme === "ember"
                  ? "border-[#ff6b00] bg-[#ff6b00]/10 ring-1 ring-[#ff6b00]"
                  : "border-border bg-surface-2/40 hover:bg-surface-2"
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold text-[#ff9e40]">EMBER</span>
                <span className="h-3 w-3 rounded-full bg-[#ff6b00] shadow-[0_0_8px_#ff6b00]" />
              </div>
              <span className="text-[11px] text-muted-foreground mt-2">
                Warm dark titanium, amber flares, solar contrast aesthetic.
              </span>
            </button>
          </div>
        </Card>

        {/* Public Ingestion & Toggles */}
        <Card className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Sliders className="text-cyan" size={18} />
            <h2 className="text-base font-display">Feature Availability Toggles</h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Control the availability of public submission channels to throttle incoming requests or
            enter focused build periods.
          </p>

          <div className="space-y-3 pt-2 font-mono text-xs">
            {/* Contact Form Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/70 bg-surface-2/30">
              <div>
                <div className="text-foreground font-medium">Public Contact Form</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Allow inbound inquiries via the homepage comms console
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.contactEnabled}
                  onChange={(e) => setSettings({ ...settings, contactEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan"></div>
              </label>
            </div>

            {/* Project Request Intake Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/70 bg-surface-2/30">
              <div>
                <div className="text-foreground font-medium">Customer Intake (/start-project)</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Accept detailed project discovery submissions
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requestsEnabled}
                  onChange={(e) => setSettings({ ...settings, requestsEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan"></div>
              </label>
            </div>

            {/* Maintenance Mode */}
            <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/70 bg-surface-2/30">
              <div>
                <div className="text-foreground font-medium">Maintenance Mode</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Display subtle system maintenance beacon on public routes
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-2 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </Card>

        {/* Security & Access Info */}
        <Card className="p-5 space-y-4 lg:col-span-2">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <Shield className="text-cyan" size={18} />
            <h2 className="text-base font-display">Authentication & Security Model</h2>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            The HZ Labs Control Center uses single-tenant environment-backed credentials (<code className="text-cyan">ADMIN_EMAIL</code> and argon2 hash <code className="text-cyan">ADMIN_PASSWORD_HASH</code>).
            No plain-text admin records are stored in the database.
          </p>

          <div className="p-4 rounded-xl border border-border/80 bg-surface-2/40 font-mono text-xs space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <KeyRound size={15} />
              <span className="font-bold">Credential Rotation Guide</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              To rotate the administrator password:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-[11px]">
              <li>Use the argon2 utility to generate an argon2id hash of your new password.</li>
              <li>Update the <code className="text-foreground font-bold">ADMIN_PASSWORD_HASH</code> environment variable in your production environment (e.g. Render / Railway / .env).</li>
              <li>The API server will immediately validate all subsequent login attempts against the new hash without database modification.</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
}
