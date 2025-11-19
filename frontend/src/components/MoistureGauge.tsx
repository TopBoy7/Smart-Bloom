import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets } from "lucide-react";

interface MoistureGaugeProps {
  value: number;
  label?: string;
}

export const MoistureGauge = ({ value, label = "Soil Moisture" }: MoistureGaugeProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const getColor = (val: number) => {
    if (val < 20) return "hsl(var(--destructive))";
    if (val < 40) return "hsl(var(--warning))";
    return "hsl(var(--success))";
  };

  const getStatus = (val: number) => {
    if (val < 20) return "Critical - Irrigate Now";
    if (val < 40) return "Low - Irrigate Soon";
    if (val < 70) return "Optimal";
    return "High";
  };

  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Droplets className="h-5 w-5 text-primary" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="hsl(var(--muted))"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke={getColor(displayValue)}
              strokeWidth="12"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold" style={{ color: getColor(displayValue) }}>
              {Math.round(displayValue)}%
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {getStatus(displayValue)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
