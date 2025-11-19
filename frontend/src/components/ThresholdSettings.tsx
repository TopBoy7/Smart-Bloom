import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Settings, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThresholdConfig {
  criticalLow: number;
  warningLow: number;
  optimal: number;
  warningHigh: number;
}

export const ThresholdSettings = () => {
  const { toast } = useToast();
  const [thresholds, setThresholds] = useState<ThresholdConfig>({
    criticalLow: 20,
    warningLow: 40,
    optimal: 60,
    warningHigh: 80,
  });

  const handleSave = () => {
    // TODO: Persist to Firestore/backend
    toast({
      title: "Settings Saved",
      description: "Moisture thresholds updated successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Moisture Thresholds
        </CardTitle>
        <CardDescription>
          Configure irrigation trigger points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="critical">Critical Low (&lt; irrigate immediately)</Label>
              <span className="text-sm font-medium text-destructive">{thresholds.criticalLow}%</span>
            </div>
            <Slider
              id="critical"
              min={0}
              max={100}
              step={5}
              value={[thresholds.criticalLow]}
              onValueChange={([value]) => setThresholds({ ...thresholds, criticalLow: value })}
              className="[&_[role=slider]]:bg-destructive"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="warning">Warning Low (irrigate soon)</Label>
              <span className="text-sm font-medium text-warning">{thresholds.warningLow}%</span>
            </div>
            <Slider
              id="warning"
              min={0}
              max={100}
              step={5}
              value={[thresholds.warningLow]}
              onValueChange={([value]) => setThresholds({ ...thresholds, warningLow: value })}
              className="[&_[role=slider]]:bg-warning"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="optimal">Optimal Target</Label>
              <span className="text-sm font-medium text-success">{thresholds.optimal}%</span>
            </div>
            <Slider
              id="optimal"
              min={0}
              max={100}
              step={5}
              value={[thresholds.optimal]}
              onValueChange={([value]) => setThresholds({ ...thresholds, optimal: value })}
              className="[&_[role=slider]]:bg-success"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="high">Warning High (over-watered)</Label>
              <span className="text-sm font-medium text-warning">{thresholds.warningHigh}%</span>
            </div>
            <Slider
              id="high"
              min={0}
              max={100}
              step={5}
              value={[thresholds.warningHigh]}
              onValueChange={([value]) => setThresholds({ ...thresholds, warningHigh: value })}
              className="[&_[role=slider]]:bg-warning"
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>Critical</span>
            <span>Warning</span>
            <span>Optimal</span>
            <span>Warning</span>
          </div>
          <div className="h-2 rounded-full bg-gradient-to-r from-destructive via-warning via-success to-warning" />
        </div>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Thresholds
        </Button>
      </CardContent>
    </Card>
  );
};
