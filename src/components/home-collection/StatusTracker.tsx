import { CollectionStatus } from "@/hooks/useHomeCollectionRequests";
import { CheckCircle2, Clock, User, FlaskConical, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusTrackerProps {
  currentStatus: CollectionStatus;
  className?: string;
}

const statusSteps: { status: CollectionStatus; label: string; icon: React.ElementType }[] = [
  { status: "requested", label: "Requested", icon: Clock },
  { status: "assigned", label: "Assigned", icon: User },
  { status: "collected", label: "Collected", icon: FlaskConical },
  { status: "processing", label: "Processing", icon: Clock },
  { status: "ready", label: "Report Ready", icon: FileCheck },
];

const statusOrder: CollectionStatus[] = ["requested", "assigned", "collected", "processing", "ready"];

export function StatusTracker({ currentStatus, className }: StatusTrackerProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex flex-col items-center flex-1 relative">
              {/* Connector line */}
              {index > 0 && (
                <div
                  className={cn(
                    "absolute top-5 -left-1/2 w-full h-0.5",
                    index <= currentIndex ? "bg-primary" : "bg-border"
                  )}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Status circle */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border-2 border-border",
                  isCurrent && "ring-4 ring-primary/20"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-xs mt-2 text-center font-medium",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
