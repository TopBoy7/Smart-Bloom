import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown, Droplets, Calendar } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import data from "@/lib/mockData"

const Reports = () => {
  const [reportDetails, setReportDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const base = import.meta.env.VITE_FRONTEND_URL ?? "";

    fetch(`${base}/api/reports`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((payload) => {
        const d = payload.data ?? payload;
        setReportDetails(d);
      })
      .catch((err) => {
        if ((err as any).name !== "AbortError") setError((err as Error).message || "Failed to load reports");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading reports…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-destructive">Error loading reports: {error}</div>
      </div>
    );
  }

  if (!reportDetails) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {reportDetails.header.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {reportDetails.header.subtitle}
            </p>
          </div>

          <Button className="gap-2">
            <Download className="h-4 w-4" />
            {reportDetails.header.exportLabel}
          </Button>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* WATER USED */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Water Used This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {reportDetails.topStats.waterUsed.amount}
              </div>
              <p className="text-sm text-success mt-1">
                {reportDetails.topStats.waterUsed.change}
              </p>
            </CardContent>
          </Card>

          {/* TOTAL SAVINGS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Total Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {reportDetails.topStats.totalSavings.percent}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {reportDetails.topStats.totalSavings.litersSaved}
              </p>
            </CardContent>
          </Card>

          {/* IRRIGATION SESSIONS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Irrigation Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {reportDetails.topStats.irrigationSessions.count}
              </div>
              <p className="text-sm text-info mt-1">
                {reportDetails.topStats.irrigationSessions.frequency}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* WEEKLY BAR CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Water Usage</CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportDetails.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

                <XAxis 
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />

                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: "Liters", angle: -90, position: "insideLeft" }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }}
                />

                <Bar dataKey="water" fill="hsl(var(--chart-2))" name="Water Used (L)" radius={[4,4,0,0]} />
                <Bar dataKey="savings" fill="hsl(var(--chart-1))" name="Savings (L)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* MONTHLY SUMMARY */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Water Used</span>
                <span className="font-semibold text-foreground">
                  {reportDetails.monthlySummary.totalUsed}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Water Saved</span>
                <span className="font-semibold text-success">
                  {reportDetails.monthlySummary.totalSaved}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Average Moisture Level</span>
                <span className="font-semibold text-foreground">
                  {reportDetails.monthlySummary.avgMoisture}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Irrigation Sessions</span>
                <span className="font-semibold text-foreground">
                  {reportDetails.monthlySummary.irrigationSessions}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">AI Optimizations</span>
                <span className="font-semibold text-info">
                  {reportDetails.monthlySummary.aiOptimizations}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Environmental Impact: Reduced water consumption equivalent to{" "}
                  <span className="font-semibold text-success">
                    {reportDetails.monthlySummary.envImpactTrees} trees
                  </span>{" "}
                  planted this month.
                </p>
              </div>

            </CardContent>
          </Card>

          {/* EFFICIENCY METRICS */}
          <Card>
            <CardHeader>
              <CardTitle>Efficiency Metrics</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* Uptime */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">System Uptime</span>
                  <span className="font-semibold text-foreground">
                    {reportDetails.efficiencyMetrics.uptime}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full"
                    style={{ width: `${reportDetails.efficiencyMetrics.uptime}%` }}
                  />
                </div>
              </div>

              {/* AI Accuracy */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">AI Accuracy</span>
                  <span className="font-semibold text-foreground">
                    {reportDetails.efficiencyMetrics.aiAccuracy}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${reportDetails.efficiencyMetrics.aiAccuracy}%` }}
                  />
                </div>
              </div>

              {/* Sensor Reliability */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Sensor Reliability</span>
                  <span className="font-semibold text-foreground">
                    {reportDetails.efficiencyMetrics.sensorReliability}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-info rounded-full"
                    style={{ width: `${reportDetails.efficiencyMetrics.sensorReliability}%` }}
                  />
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Reports;
