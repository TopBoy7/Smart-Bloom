import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Droplets, Calendar, Plus, Play, Pause, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";


const Schedule = () => {
  const { toast } = useToast();

  // remote-backed schedule state
  const [scheduleDetails, setScheduleDetails] = useState<any | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const base = import.meta.env.VITE_FRONTEND_URL ?? "";

    fetch(`${base}/api/schedule`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((payload) => {
        const d = payload.data ?? payload;
        setScheduleDetails(d);
        setSchedules(d?.recurring ?? []);
      })
      .catch((err) => {
        if ((err as any).name !== "AbortError") setError((err as Error).message || "Failed to load schedule");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const toggleSchedule = (id: number) => {
    const schedule = schedules.find((s) => s.id === id);
    setSchedules(
      schedules.map((s) =>
        s.id === id ? { ...s, active: !s.active } : s
      )
    );
    toast({
      title: schedule?.active ? "Schedule Disabled" : "Schedule Enabled",
      description: `${schedule?.name} has been ${schedule?.active ? "disabled" : "enabled"}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-muted text-muted-foreground";
      case "active":
        return "bg-primary text-primary-foreground";
      case "scheduled":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading schedule…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-destructive">Error loading schedule: {error}</div>
      </div>
    );
  }

  if (!scheduleDetails) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {scheduleDetails.page.title}
            </h1>
            <p className="text-muted-foreground mt-1">
              {scheduleDetails.page.subtitle}
            </p>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            {scheduleDetails.page.addScheduleLabel}
          </Button>
        </div>

        {/* AI FORECAST & TODAY'S SCHEDULE */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* AI FORECAST */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Forecast & Suggestions
              </CardTitle>
              <CardDescription>ML-powered irrigation optimization</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-info mt-2" />
                  <div>
                    <p className="font-medium text-foreground">Next Suggested Irrigation</p>
                    <p className="text-sm text-muted-foreground">
                      Today at {scheduleDetails.aiForecast.nextIrrigation.time} ({scheduleDetails.aiForecast.nextIrrigation.inHours})
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duration: {scheduleDetails.aiForecast.nextIrrigation.duration} minutes • Expected moisture increase: {scheduleDetails.aiForecast.nextIrrigation.moistureIncrease}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: {scheduleDetails.aiForecast.nextIrrigation.confidence} • {scheduleDetails.aiForecast.nextIrrigation.analysis}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div>
                    <p className="font-medium text-foreground">Optimal Window</p>
                    <p className="text-sm text-muted-foreground">
                      {scheduleDetails.aiForecast.optimalWindow.range}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scheduleDetails.aiForecast.optimalWindow.savings}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-2">
                  Forecast Model: {scheduleDetails.aiForecast.model.type}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">MAE:</span>
                    <span className="ml-1 font-medium">{scheduleDetails.aiForecast.model.mae}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="ml-1 font-medium">{scheduleDetails.aiForecast.model.accuracy}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Bot className="h-4 w-4 mr-2" />
                {scheduleDetails.aiForecast.buttonLabel}
              </Button>
            </CardContent>
          </Card>

          {/* TODAY SCHEDULE */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Real-time irrigation status</CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {scheduleDetails.todaySchedule.map((schedule: any) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold text-lg">{schedule.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-info" />
                      <span className="text-sm text-muted-foreground">
                        {schedule.duration} min
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(schedule.status)}>
                      {schedule.status}
                    </Badge>

                    {schedule.status === "active" && (
                      <Button size="sm" variant="outline">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}

                    {schedule.status === "scheduled" && (
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RECURRING SCHEDULES */}
        <Card>
          <CardHeader>
            <CardTitle>Recurring Schedules</CardTitle>
            <CardDescription>Manage automated irrigation schedules</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-foreground">{schedule.name}</h3>

                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {schedule.time}
                    </div>

                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4" />
                      {schedule.duration} min
                    </div>

                    <div className="flex gap-1">
                      {schedule.days.map((day: string) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={schedule.active ? "default" : "secondary"}>
                    {schedule.active ? "Active" : "Paused"}
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleSchedule(schedule.id)}
                  >
                    {schedule.active ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* QUICK ACTIONS + NEXT 24h + THIS WEEK */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                {scheduleDetails.quickActions.skipToday}
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Droplets className="h-4 w-4 mr-2" />
                {scheduleDetails.quickActions.waterNow}
              </Button>
            </CardContent>
          </Card>

          {/* NEXT 24 HOURS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Next 24 Hours</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-semibold">{scheduleDetails.next24hours.scheduled}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Duration</span>
                  <span className="font-semibold">{scheduleDetails.next24hours.duration}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Water Use</span>
                  <span className="font-semibold">{scheduleDetails.next24hours.estimatedUse}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* THIS WEEK */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">This Week</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold">{scheduleDetails.thisWeek.completed}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Water Saved</span>
                  <span className="font-semibold text-success">{scheduleDetails.thisWeek.saved}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Efficiency</span>
                  <span className="font-semibold">{scheduleDetails.thisWeek.efficiency}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
