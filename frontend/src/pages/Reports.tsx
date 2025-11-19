import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown, Droplets, Calendar } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Reports = () => {
  const weeklyData = [
    { day: "Mon", water: 45, savings: 12 },
    { day: "Tue", water: 38, savings: 15 },
    { day: "Wed", water: 42, savings: 10 },
    { day: "Thu", water: 35, savings: 18 },
    { day: "Fri", water: 40, savings: 14 },
    { day: "Sat", water: 36, savings: 16 },
    { day: "Sun", water: 39, savings: 13 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">Water usage and efficiency metrics</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Water Used This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">275 L</div>
              <p className="text-sm text-success mt-1">↓ 18% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Total Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">22%</div>
              <p className="text-sm text-muted-foreground mt-1">≈ 62 liters saved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Irrigation Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">21</div>
              <p className="text-sm text-info mt-1">3 per day average</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Water Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  label={{ value: 'Liters', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="water" fill="hsl(var(--chart-2))" name="Water Used (L)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="savings" fill="hsl(var(--chart-1))" name="Savings (L)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Water Used</span>
                <span className="font-semibold text-foreground">1,240 L</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Water Saved</span>
                <span className="font-semibold text-success">280 L (18%)</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Average Moisture Level</span>
                <span className="font-semibold text-foreground">48%</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Irrigation Sessions</span>
                <span className="font-semibold text-foreground">92</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">AI Optimizations</span>
                <span className="font-semibold text-info">34</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Efficiency Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">System Uptime</span>
                  <span className="font-semibold text-foreground">99.8%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success rounded-full" style={{ width: "99.8%" }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">AI Accuracy</span>
                  <span className="font-semibold text-foreground">94%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Sensor Reliability</span>
                  <span className="font-semibold text-foreground">97%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-info rounded-full" style={{ width: "97%" }} />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Environmental Impact: Reduced water consumption equivalent to <span className="font-semibold text-success">14 trees</span> planted this month.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Reports;
