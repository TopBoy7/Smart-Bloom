import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface DataPoint {
  time: string;
  moisture: number;
  temperature: number;
}

interface MoistureChartProps {
  data: DataPoint[];
}

export const MoistureChart = ({ data }: MoistureChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>24-Hour Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line 
              type="monotone" 
              dataKey="moisture" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              name="Moisture %"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="hsl(var(--chart-3))" 
              strokeWidth={2}
              name="Temperature °C"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
