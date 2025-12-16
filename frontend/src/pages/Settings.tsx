import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThresholdSettings } from "@/components/ThresholdSettings";
import { Bell, Wifi, Database } from "lucide-react";

const Settings = () => {
  const [settingsDetails, setSettingsDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const base = import.meta.env.VITE_FRONTEND_URL ?? "";

    fetch(`${base}/api/settings`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((payload) => {
        const d = payload.data ?? payload;
        setSettingsDetails(d);
      })
      .catch((err) => {
        if ((err as any).name !== "AbortError")
          setError((err as Error).message || "Failed to load settings");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // Use general types to avoid runtime/type-expression issues
  const updateIrrigation = (updates: Partial<any>) => {
    setSettingsDetails((prev: any) =>
      prev ? { ...prev, irrigation: { ...prev.irrigation, ...updates } } : prev
    );
  };

  const updateNotifications = (key: string, value: boolean) => {
    setSettingsDetails((prev: any) =>
      prev ? { ...prev, notifications: { ...prev.notifications, [key]: value } } : prev
    );
  };

  const updateConnection = (updates: Partial<any>) => {
    setSettingsDetails((prev: any) =>
      prev ? { ...prev, connection: { ...prev.connection, ...updates } } : prev
    );
  };

  const updateDataManagement = (updates: Partial<any>) => {
    setSettingsDetails((prev: any) =>
      prev ? { ...prev, dataManagement: { ...prev.dataManagement, ...updates } } : prev
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading settings…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-destructive">Error loading settings: {error}</div>
      </div>
    );
  }

  if (!settingsDetails) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your irrigation system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Threshold Settings */}
          <ThresholdSettings />

          {/* IRRIGATION SETTINGS */}
          <Card>
            <CardHeader>
              <CardTitle>Irrigation Settings</CardTitle>
              <CardDescription>Configure automatic irrigation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Default Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={String(settingsDetails.irrigation.defaultDuration ?? "")}
                  onChange={(e) =>
                    updateIrrigation({
                      defaultDuration: Number.isFinite(Number(e.target.value))
                        ? parseInt(e.target.value, 10)
                        : settingsDetails.irrigation.defaultDuration,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow">Flow Rate (L/min)</Label>
                <Input
                  id="flow"
                  type="number"
                  value={String(settingsDetails.irrigation.flowRate ?? "")}
                  onChange={(e) =>
                    updateIrrigation({
                      flowRate: Number.isFinite(Number(e.target.value))
                        ? parseFloat(e.target.value)
                        : settingsDetails.irrigation.flowRate,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Schedule</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable AI-based automatic scheduling
                  </p>
                </div>
                <Switch
                  checked={Boolean(settingsDetails.irrigation.autoSchedule)}
                  onCheckedChange={(checked) => updateIrrigation({ autoSchedule: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rain Detection</Label>
                  <p className="text-xs text-muted-foreground">Skip irrigation during rain</p>
                </div>
                <Switch
                  checked={Boolean(settingsDetails.irrigation.rainDetection)}
                  onCheckedChange={(checked) => updateIrrigation({ rainDetection: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* NOTIFICATIONS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Manage alert preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["critical", "warnings", "dailySummary"].map((key) => (
                <div className="flex items-center justify-between" key={key}>
                  <div className="space-y-0.5">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                    <p className="text-xs text-muted-foreground">
                      {key === "critical"
                        ? "Immediate irrigation required"
                        : key === "warnings"
                        ? "Low moisture warnings"
                        : "Water usage reports"}
                    </p>
                  </div>
                  <Switch
                    checked={Boolean(settingsDetails.notifications?.[key])}
                    onCheckedChange={(checked) => updateNotifications(key, checked)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CONNECTION SETTINGS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Connection Settings
              </CardTitle>
              <CardDescription>Configure IoT device and backend connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>MQTT Broker URL</Label>
                <Input
                  value={settingsDetails.connection.mqttBroker ?? ""}
                  onChange={(e) => updateConnection({ mqttBroker: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Sensor ID / Farm ID</Label>
                <Input
                  value={`${settingsDetails.connection.farmId ?? ""}-${settingsDetails.connection.sensorId ?? ""}`}
                  onChange={(e) => {
                    const [farm = "", sensor = ""] = e.target.value.split("-");
                    updateConnection({ farmId: farm, sensorId: sensor });
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label>MQTT Topic</Label>
                <Input
                  value={settingsDetails.connection.topic ?? ""}
                  onChange={(e) => updateConnection({ topic: e.target.value })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Realtime Sync</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable WebSocket/Firestore listeners
                  </p>
                </div>
                <Switch
                  checked={Boolean(settingsDetails.connection.realtime)}
                  onCheckedChange={(checked) => updateConnection({ realtime: checked })}
                />
              </div>

              <Button variant="outline" className="w-full">
                Test Connection
              </Button>
            </CardContent>
          </Card>

          {/* DATA MANAGEMENT */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Configure data retention and storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Data Retention (days)</Label>
                <Input
                  type="number"
                  value={String(settingsDetails.dataManagement.retentionDays ?? "")}
                  onChange={(e) =>
                    updateDataManagement({
                      retentionDays: Number.isFinite(Number(e.target.value))
                        ? parseInt(e.target.value, 10)
                        : settingsDetails.dataManagement.retentionDays,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Sample Rate (seconds)</Label>
                <Input
                  type="number"
                  value={String(settingsDetails.dataManagement.sampleRate ?? "")}
                  onChange={(e) =>
                    updateDataManagement({
                      sampleRate: Number.isFinite(Number(e.target.value))
                        ? parseInt(e.target.value, 10)
                        : settingsDetails.dataManagement.sampleRate,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Batch Writes</Label>
                  <p className="text-xs text-muted-foreground">Aggregate data to reduce DB writes</p>
                </div>
                <Switch
                  checked={Boolean(settingsDetails.dataManagement.batchWrites)}
                  onCheckedChange={(checked) => updateDataManagement({ batchWrites: checked })}
                />
              </div>

              <Button variant="outline" className="w-full">
                Export All Data
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* SYSTEM INFO */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-semibold">{settingsDetails.systemInfo.version}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Sync</p>
                <p className="font-semibold">{settingsDetails.systemInfo.lastSync}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Device Status</p>
                <p className="font-semibold text-success">{settingsDetails.systemInfo.deviceStatus}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Backend</p>
                <p className="font-semibold">{settingsDetails.systemInfo.backend}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
