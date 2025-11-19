import { useState, useEffect } from "react";
import { MoistureGauge } from "@/components/MoistureGauge";
import { EnvironmentCard } from "@/components/EnvironmentCard";
import { MoistureChart } from "@/components/MoistureChart";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Wind, Power, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours() + ":00",
      moisture: Math.floor(35 + Math.random() * 20 + Math.sin(i / 4) * 10),
      temperature: Math.floor(22 + Math.random() * 8 + Math.cos(i / 3) * 3),
    });
  }
  
  return data;
};

const Dashboard = () => {
  const { toast } = useToast();
  const [moisture, setMoisture] = useState(45);
  const [temperature, setTemperature] = useState(28);
  const [humidity, setHumidity] = useState(62);
  const [connected, setConnected] = useState(true);
  const [chartData] = useState(generateMockData());
  const [lastUpdate, setLastUpdate] = useState(new Date().toLocaleTimeString());
  const [isIrrigating, setIsIrrigating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates (ready for Firestore/WebSocket integration)
      setMoisture(prev => {
        let newVal = prev + (Math.random() - 0.5) * 3;
        if (isIrrigating) newVal += 0.5; // Moisture increases during irrigation
        return Math.max(20, Math.min(80, newVal));
      });
      setTemperature(prev => Math.max(20, Math.min(35, prev + (Math.random() - 0.5) * 2)));
      setHumidity(prev => Math.max(40, Math.min(90, prev + (Math.random() - 0.5) * 4)));
      setLastUpdate(new Date().toLocaleTimeString());
    }, 5000);

    return () => clearInterval(interval);
  }, [isIrrigating]);

  const handleManualIrrigation = () => {
    setIsIrrigating(true);
    toast({
      title: "Irrigation Started",
      description: "Manual irrigation activated for 10 minutes",
    });
    
    // Auto-stop after 10 minutes (simulated as 30 seconds for demo)
    setTimeout(() => {
      setIsIrrigating(false);
      toast({
        title: "Irrigation Completed",
        description: "Manual irrigation cycle finished",
      });
    }, 30000);
  };

  const stopIrrigation = () => {
    setIsIrrigating(false);
    toast({
      title: "Irrigation Stopped",
      description: "Manual irrigation stopped",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Real-time irrigation monitoring</p>
          </div>
          <StatusIndicator connected={connected} lastUpdate={lastUpdate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <MoistureGauge value={moisture} />
            
            {/* Quick Action Controls */}
            <div className="bg-card rounded-lg border border-border p-4">
              <h3 className="font-semibold text-sm mb-3 text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                {!isIrrigating ? (
                  <Button 
                    onClick={handleManualIrrigation}
                    className="w-full"
                    size="lg"
                  >
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
                  onClick={() => window.location.href = '/schedule'}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </div>
              {isIrrigating && (
                <div className="mt-3 p-2 bg-primary/10 rounded text-sm text-primary">
                  ⚡ Irrigation in progress...
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <EnvironmentCard
              title="Temperature"
              value={temperature}
              unit="°C"
              icon={Thermometer}
              trend="up"
            />
            <EnvironmentCard
              title="Humidity"
              value={humidity}
              unit="%"
              icon={Droplets}
              trend="stable"
            />
            <EnvironmentCard
              title="Wind Speed"
              value={12}
              unit="km/h"
              icon={Wind}
              trend="down"
            />
          </div>
        </div>

        <MoistureChart data={chartData} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-lg mb-4 text-foreground">AI Recommendations</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-md bg-success/10">
                <div className="w-2 h-2 rounded-full bg-success mt-2" />
                <div>
                  <p className="font-medium text-foreground">Optimal Conditions</p>
                  <p className="text-sm text-muted-foreground">Current moisture levels are ideal. No irrigation needed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-md bg-info/10">
                <div className="w-2 h-2 rounded-full bg-info mt-2" />
                <div>
                  <p className="font-medium text-foreground">Next Watering</p>
                  <p className="text-sm text-muted-foreground">Predicted in 6 hours based on current trend.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="font-semibold text-lg mb-4 text-foreground">Water Savings</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-semibold text-foreground">22% saved</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "22%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-semibold text-foreground">18% saved</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "18%" }} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground pt-2">
                ≈ 450 liters saved compared to traditional irrigation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
