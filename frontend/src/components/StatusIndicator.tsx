import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface StatusIndicatorProps {
  connected: boolean;
  lastUpdate?: string;
}

export const StatusIndicator = ({ connected, lastUpdate }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-4">
      <Badge 
        variant={connected ? "default" : "destructive"}
        className="flex items-center gap-1.5 px-3 py-1"
      >
        {connected ? (
          <>
            <Wifi className="h-3.5 w-3.5" />
            Connected
          </>
        ) : (
          <>
            <WifiOff className="h-3.5 w-3.5" />
            Disconnected
          </>
        )}
      </Badge>
      {lastUpdate && (
        <span className="text-sm text-muted-foreground">
          Last update: {lastUpdate}
        </span>
      )}
    </div>
  );
};
