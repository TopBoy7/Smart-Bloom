import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Droplets, Calendar, Plus, Play, Pause, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Schedule = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState([
    { id: 1, name: "Morning Irrigation", time: "06:00", duration: 15, days: ["Mon", "Wed", "Fri"], active: true },
    { id: 2, name: "Evening Watering", time: "18:00", duration: 20, days: ["Tue", "Thu", "Sat"], active: true },
    { id: 3, name: "Weekend Deep Water", time: "07:00", duration: 30, days: ["Sun"], active: false },
  ]);

  const [todaySchedule] = useState([
    { id: "1", time: "06:00", duration: 15, status: "completed" as const, type: "auto" as const },
    { id: "2", time: "14:00", duration: 20, status: "active" as const, type: "auto" as const },
    { id: "3", time: "18:00", duration: 15, status: "scheduled" as const, type: "auto" as const },
  ]);

  const toggleSchedule = (id: number) => {
    const schedule = schedules.find(s => s.id === id);
    setSchedules(schedules.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ));
    toast({
      title: schedule?.active ? "Schedule Disabled" : "Schedule Enabled",
      description: `${schedule?.name} has been ${schedule?.active ? "disabled" : "enabled"}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-muted text-muted-foreground";
      case "active": return "bg-primary text-primary-foreground";
      case "scheduled": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Irrigation Schedule</h1>
            <p className="text-muted-foreground mt-1">AI-optimized watering times</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                AI Forecast & Suggestions
              </CardTitle>
              <CardDescription>
                ML-powered irrigation optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-info mt-2" />
                  <div>
                    <p className="font-medium text-foreground">Next Suggested Irrigation</p>
                    <p className="text-sm text-muted-foreground">Today at 6:00 PM (in 3 hours)</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Duration: 15 minutes • Expected moisture increase: 25%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: 92% • Based on 7-day pattern analysis
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-success mt-2" />
                  <div>
                    <p className="font-medium text-foreground">Optimal Window</p>
                    <p className="text-sm text-muted-foreground">5:00 AM - 7:00 AM tomorrow</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower evaporation rate • 20% water savings
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted">
                <p className="text-xs text-muted-foreground mb-2">Forecast Model: Linear Regression</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">MAE:</span>
                    <span className="ml-1 font-medium">2.3%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Accuracy:</span>
                    <span className="ml-1 font-medium">94.7%</span>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                <Bot className="h-4 w-4 mr-2" />
                Apply AI Recommendations
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>
                Real-time irrigation status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaySchedule.map((schedule) => (
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

        <Card>
          <CardHeader>
            <CardTitle>Recurring Schedules</CardTitle>
            <CardDescription>
              Manage automated irrigation schedules
            </CardDescription>
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
                      {schedule.days.map((day) => (
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
                    {schedule.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Skip Today
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Droplets className="h-4 w-4 mr-2" />
                Water Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Next 24 Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-semibold">3 sessions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Duration</span>
                  <span className="font-semibold">50 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Water Use</span>
                  <span className="font-semibold">250 L</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-semibold">12 sessions</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Water Saved</span>
                  <span className="font-semibold text-success">22%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Efficiency</span>
                  <span className="font-semibold">96%</span>
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
