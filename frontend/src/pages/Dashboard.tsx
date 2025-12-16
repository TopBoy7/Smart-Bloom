import { useState, useEffect } from "react";
import { MoistureGauge } from "@/components/MoistureGauge";
import { EnvironmentCard } from "@/components/EnvironmentCard";
import { MoistureChart } from "@/components/MoistureChart";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Wind, Power, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import data from "@/lib/mockData"



const Dashboard = () => {
  const { toast } = useToast();

  // remote-backed data
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch initial dashboard payload from backend
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const base = import.meta.env.VITE_FRONTEND_URL ?? "";

    fetch(`${base}/api/dashboard`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((payload) => {
        const d = payload.data ?? payload;
        setDashboardData(d);
      })
      .catch((err) => {
        if ((err as any).name !== "AbortError") setError((err as Error).message || "Failed to load dashboard");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  // simulated real-time updates — only run when we have data
  useEffect(() => {
    if (!dashboardData) return;
    const interval = setInterval(() => {
      setDashboardData((prev: any) => ({
        ...prev,
        moisture: Math.max(
          20,
          Math.min(
            80,
            prev.moisture + (Math.random() - 0.5) * 3 + (prev.isIrrigating ? 0.5 : 0)
          )
        ),
        temperature: Number(
          Math.max(20, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)).toFixed(2)
        ),
        humidity: Number(
          Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 4)).toFixed(2)
        ),
        lastUpdate: new Date().toLocaleTimeString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [dashboardData?.isIrrigating, dashboardData]);

  // manual irrigation handlers — guard for null
  const handleManualIrrigation = () => {
    if (!dashboardData) return;
    setDashboardData((prev: any) => ({ ...prev, isIrrigating: true }));

    toast({
      title: "Irrigation Started",
      description: "Manual irrigation activated for 10 minutes",
    });

    setTimeout(() => {
      setDashboardData((prev: any) => ({ ...prev, isIrrigating: false }));

      toast({
        title: "Irrigation Completed",
        description: "Manual irrigation cycle finished",
      });
    }, 30000);
  };

  const stopIrrigation = () => {
    if (!dashboardData) return;
    setDashboardData((prev: any) => ({ ...prev, isIrrigating: false }));

    toast({
      title: "Irrigation Stopped",
      description: "Manual irrigation stopped",
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading dashboard…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-destructive">Error loading dashboard: {error}</div>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time irrigation monitoring</p>
          </div>

          <StatusIndicator
            connected={dashboardData.connected}
            lastUpdate={dashboardData.lastUpdate}
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-1 space-y-4">
            <MoistureGauge value={dashboardData.moisture} />

            {/* QUICK ACTIONS */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-3 text-foreground">
                Quick Actions
              </h3>

              <div className="space-y-2">
                {!dashboardData.isIrrigating ? (
                  <Button onClick={handleManualIrrigation} className="w-full" size="lg">
                    <Power className="h-4 w-4 mr-2" />
                    Start Irrigation
                  </Button>
                ) : (
                  <Button
                    onClick={stopIrrigation}
                    variant="destructive"
                    className="w-full"
                    size="lg"
                  >
                    <Power className="h-4 w-4 mr-2" />
                    Stop Irrigation
                  </Button>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => (window.location.href = "/schedule")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </div>

              {dashboardData.isIrrigating && (
                <div className="mt-3 p-2 bg-primary/10 rounded text-sm text-primary">
                  ⚡ Irrigation in progress...
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnvironmentCard
              title="Temperature"
              value={dashboardData.temperature}
              unit="°C"
              icon={Thermometer}
              trend="up"
            />

            <EnvironmentCard
              title="Humidity"
              value={dashboardData.humidity}
              unit="%"
              icon={Droplets}
              trend="stable"
            />

            <EnvironmentCard
              title="Wind Speed"
              value={dashboardData.windSpeed}
              unit="km/h"
              icon={Wind}
              trend="down"
            />
          </div>
        </div>

        <MoistureChart data={dashboardData.chartData} />

        {/* AI & WATER SAVINGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* AI Recommendations */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-lg mb-4 text-foreground">
              AI Recommendations
            </h3>

            <div className="space-y-3">
              {dashboardData.aiRecommendations.map((rec: any, index: number) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-md bg-${rec.color}/10`}
                >
                  <div className={`w-2 h-2 rounded-full bg-${rec.color} mt-2`} />
                  <div>
                    <p className="font-medium text-foreground">{rec.title}</p>
                    <p className="text-sm text-muted-foreground">{rec.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Water Savings */}
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-lg mb-4 text-foreground">
              Water Savings
            </h3>

            <div className="space-y-4">
              {/* WEEK */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold text-foreground">
                    {dashboardData.waterSavings.week}% saved
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${dashboardData.waterSavings.week}%` }}
                  />
                </div>
              </div>

              {/* MONTH */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold text-foreground">
                    {dashboardData.waterSavings.month}% saved
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${dashboardData.waterSavings.month}%` }}
                  />
                </div>
              </div>

              <p className="text-sm text-muted-foreground pt-2">
                ≈ {dashboardData.waterSavings.totalLitersSaved} liters saved
                compared to traditional irrigation
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
