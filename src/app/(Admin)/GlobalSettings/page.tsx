"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ToastContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ApiError } from "@/lib/api";
import { type GlobalSettings, getSettings, updateSettings } from "@/lib/api/settings";
import { SettingsHeader } from "./components/SettingsHeader";
import { SettingsSkeleton } from "./components/SettingsSkeleton";
import { ThresholdCard } from "./components/ThresholdCard";

export default function GlobalSettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const canEdit = user?.role === "ADMIN" || user?.role === "GRANTOR";

  const fetchSettings = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setLoadError("");
    try {
      setSettings(await getSettings());
    } catch (err) {
      console.error("Failed to load settings:", err);
      setLoadError(err instanceof ApiError ? err.message : "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  async function handleSave(threshold: number): Promise<void> {
    try {
      await updateSettings(threshold);
      showToast("Grade threshold updated.");
      await fetchSettings(true);
    } catch (err) {
      console.error("Failed to update settings:", err);
      throw new Error(err instanceof ApiError ? err.message : "Failed to update threshold.");
    }
  }

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="min-h-full bg-[#faf8f5]">
      <SettingsHeader />

      <div className="px-5 pb-24 md:px-10">
        {loadError || !settings ? (
          <Card className="mt-5 rounded-[18px]! shadow-va-sm">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-14 text-center">
              <p className="text-base font-semibold">Could not load settings</p>
              <p className="text-sm text-muted-foreground">{loadError || "Settings not found."}</p>
              <Button type="button" className="h-11 px-5 text-sm!" onClick={() => fetchSettings()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ThresholdCard settings={settings} canEdit={canEdit} onSave={handleSave} />
        )}
      </div>
    </div>
  );
}
