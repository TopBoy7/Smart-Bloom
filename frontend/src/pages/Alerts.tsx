import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Droplets, Thermometer, WifiOff, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  icon: "moisture" | "temperature" | "sensor" | "success";
}

type AlertData = {
  summary: { critical: number; warning: number; info: number; total: number };
  alerts: Alert[];
  settings: Record<string, { title: string; description: string }>;
};

const Alerts = () => {
  const [alertDetails, setAlertDetails] = useState<AlertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-destructive bg-destructive/5";
      case "warning":
        return "border-warning bg-warning/5";
      case "info":
        return "border-info bg-info/5";
      default:
        return "border-border";
    }
  };

  const getBadgeVariant = (type: string): "destructive" | "default" | "secondary" => {
    switch (type) {
      case "critical":
        return "destructive";
      case "warning":
        return "default";
      case "info":
        return "secondary";
      default:
        return "default";
    }
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case "moisture":
        return <Droplets className="h-5 w-5" />;
      case "temperature":
        return <Thermometer className="h-5 w-5" />;
      case "sensor":
        return <WifiOff className="h-5 w-5" />;
      case "success":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const base = import.meta.env.VITE_FRONTEND_URL ?? "";
    
    fetch(`${base}/api/alert`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((payload) => {
        // backend returns { key, data } — accept either shape
        const d = payload.data ?? payload;
        setAlertDetails(d);
      })
      .catch((err) => {
        if ((err as any).name !== "AbortError") setError((err as Error).message || "Failed to load alerts");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading alerts…</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-destructive">Error loading alerts: {error}</div>
      </div>
    );

  if (!alertDetails) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
            <p className="text-muted-foreground mt-1">System alerts and warnings</p>
          </div>
          <Button variant="outline">Mark All as Read</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Critical</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{alertDetails.summary.critical}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Warnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{alertDetails.summary.warning}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info">{alertDetails.summary.info}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{alertDetails.summary.total}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alertDetails.alerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-2 ${getAlertColor(alert.type)} transition-all hover:shadow-md`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-0.5 ${alert.type === "critical" ? "text-destructive" : alert.type === "warning" ? "text-warning" : "text-info"}`}>
                      {getIcon(alert.icon)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{alert.title}</h3>
                        <Badge variant={getBadgeVariant(alert.type)} className="capitalize">
                          {alert.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(alertDetails.settings).map(([key, setting]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{setting.title}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Alerts;
