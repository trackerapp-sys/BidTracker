import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endTime: Date;
  compact?: boolean;
}

export function CountdownTimer({ endTime, compact = false }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [status, setStatus] = useState<"normal" | "warning" | "critical">("normal");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        setStatus("critical");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (diff < 3600000) {
        setStatus("critical");
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else if (diff < 21600000) {
        setStatus("warning");
        setTimeLeft(days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`);
      } else {
        setStatus("normal");
        setTimeLeft(days > 0 ? `${days}d ${hours}h` : `${hours}h ${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  const colorClass = 
    status === "critical" ? "text-destructive" :
    status === "warning" ? "text-warning" :
    "text-success";

  if (compact) {
    return (
      <span className={`text-sm font-medium ${colorClass}`} data-testid="text-countdown">
        {timeLeft}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${colorClass}`} />
      <span className={`text-sm font-medium ${colorClass}`} data-testid="text-countdown">
        {timeLeft}
      </span>
    </div>
  );
}
