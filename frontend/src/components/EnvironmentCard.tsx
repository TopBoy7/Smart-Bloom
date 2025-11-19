import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface EnvironmentCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "stable";
}

export const EnvironmentCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon,
  trend = "stable" 
}: EnvironmentCardProps) => {
  const getTrendColor = () => {
    if (trend === "up") return "text-warning";
    if (trend === "down") return "text-info";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">
            {value}
          </span>
          <span className="text-lg text-muted-foreground">{unit}</span>
        </div>
        <p className={`text-xs mt-2 ${getTrendColor()}`}>
          {trend === "up" && "↑ Increasing"}
          {trend === "down" && "↓ Decreasing"}
          {trend === "stable" && "→ Stable"}
        </p>
      </CardContent>
    </Card>
  );
};
