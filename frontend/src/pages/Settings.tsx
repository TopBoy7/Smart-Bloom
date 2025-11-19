import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ThresholdSettings } from "@/components/ThresholdSettings";
import { Settings as SettingsIcon, Bell, Droplets, Wifi, Database } from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    moistureThreshold: 40,
    defaultDuration: 15,
    autoSchedule: true,
    rainDetection: false,
    notifications: {
      critical: true,
      warnings: true,
      dailySummary: false,
    },
    flowRate: 5.0,
  });

  const updateSettings = (updates: Partial<typeof settings>) => {
    setSettings({ ...settings, ...updates });
  };

  const updateNotifications = (key: keyof typeof settings.notifications, value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your irrigation system</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ThresholdSettings />

          <Card>
            <CardHeader>
              <CardTitle>Irrigation Settings</CardTitle>
              <CardDescription>
                Configure automatic irrigation parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Default Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={settings.defaultDuration}
                  onChange={(e) => updateSettings({ defaultDuration: parseInt(e.target.value) })}
                  min="1"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flow">Flow Rate (L/min)</Label>
                <Input
                  id="flow"
                  type="number"
                  value={settings.flowRate}
                  onChange={(e) => updateSettings({ flowRate: parseFloat(e.target.value) })}
                  step="0.1"
                  min="0.1"
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
                  checked={settings.autoSchedule}
                  onCheckedChange={(checked) => updateSettings({ autoSchedule: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Rain Detection</Label>
                  <p className="text-xs text-muted-foreground">
                    Skip irrigation during rain
                  </p>
                </div>
                <Switch
                  checked={settings.rainDetection}
                  onCheckedChange={(checked) => updateSettings({ rainDetection: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage alert preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Critical Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Immediate irrigation required
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.critical}
                  onCheckedChange={(checked) => updateNotifications("critical", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Warning Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Low moisture warnings
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.warnings}
                  onCheckedChange={(checked) => updateNotifications("warnings", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Summary</Label>
                  <p className="text-xs text-muted-foreground">
                    Water usage reports
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.dailySummary}
                  onCheckedChange={(checked) => updateNotifications("dailySummary", checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Connection Settings
              </CardTitle>
              <CardDescription>
                Configure IoT device and backend connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mqtt-broker">MQTT Broker URL</Label>
                <Input
                  id="mqtt-broker"
                  placeholder="mqtt://broker.example.com:1883"
                  defaultValue="mqtt://localhost:1883"
                />
                <p className="text-xs text-muted-foreground">
                  HiveMQ Cloud or Mosquitto broker endpoint
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sensor-id">Sensor ID / Farm ID</Label>
                <Input
                  id="sensor-id"
                  placeholder="farm1-sensor1"
                  defaultValue="farm1-sensor1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">MQTT Topic</Label>
                <Input
                  id="topic"
                  placeholder="farm/{farmId}/sensor/{sensorId}/data"
                  defaultValue="farm/farm1/sensor/sensor1/data"
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
                <Switch defaultChecked />
              </div>

              <Button variant="outline" className="w-full">
                <Wifi className="h-4 w-4 mr-2" />
                Test Connection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>
                Configure data retention and storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="retention">Data Retention (days)</Label>
                <Input
                  id="retention"
                  type="number"
                  defaultValue="30"
                  min="7"
                  max="365"
                />
                <p className="text-xs text-muted-foreground">
                  Historical data older than this will be archived
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sample">Sample Rate (seconds)</Label>
                <Input
                  id="sample"
                  type="number"
                  defaultValue="5"
                  min="1"
                  max="60"
                />
                <p className="text-xs text-muted-foreground">
                  Sensor reading frequency
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Batch Writes</Label>
                  <p className="text-xs text-muted-foreground">
                    Aggregate data to reduce DB writes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button variant="outline" className="w-full">
                Export All Data
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Version</p>
                <p className="font-semibold">1.0.0</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Sync</p>
                <p className="font-semibold">2 minutes ago</p>
              </div>
              <div>
                <p className="text-muted-foreground">Device Status</p>
                <p className="font-semibold text-success">Connected</p>
              </div>
              <div>
                <p className="text-muted-foreground">Backend</p>
                <p className="font-semibold">Firestore + MQTT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
