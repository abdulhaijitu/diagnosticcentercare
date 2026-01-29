import { useState, useEffect } from "react";
import { CollectionStatus, StatusHistory } from "@/hooks/useHomeCollectionRequests";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Clock, User, FlaskConical, FileCheck, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EnhancedStatusTrackerProps {
  requestId: string;
  currentStatus: CollectionStatus;
  className?: string;
}

const statusSteps: { status: CollectionStatus; label: string; labelBn: string; icon: React.ElementType }[] = [
  { status: "requested", label: "Requested", labelBn: "অনুরোধ", icon: Clock },
  { status: "assigned", label: "Assigned", labelBn: "নির্ধারিত", icon: User },
  { status: "collected", label: "Collected", labelBn: "সংগৃহীত", icon: FlaskConical },
  { status: "processing", label: "Processing", labelBn: "প্রক্রিয়াধীন", icon: Clock },
  { status: "ready", label: "Report Ready", labelBn: "রিপোর্ট প্রস্তুত", icon: FileCheck },
];

const statusOrder: CollectionStatus[] = ["requested", "assigned", "collected", "processing", "ready"];

const statusMessages: Record<CollectionStatus, string> = {
  requested: "আপনার অনুরোধ সফলভাবে গ্রহণ করা হয়েছে",
  assigned: "একজন স্টাফ আপনার নমুনা সংগ্রহে নিযুক্ত হয়েছেন",
  collected: "আপনার নমুনা সংগ্রহ করা হয়েছে এবং ল্যাবে পাঠানো হচ্ছে",
  processing: "আপনার নমুনা ল্যাবে প্রক্রিয়াধীন আছে",
  ready: "আপনার রিপোর্ট প্রস্তুত! ডাউনলোড করতে পারেন",
};

export function EnhancedStatusTracker({ requestId, currentStatus, className }: EnhancedStatusTrackerProps) {
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [previousStatus, setPreviousStatus] = useState<CollectionStatus>(currentStatus);
  const { toast } = useToast();
  const currentIndex = statusOrder.indexOf(currentStatus);

  // Fetch status history
  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("collection_status_history")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setHistory(data as StatusHistory[]);
      }
    };

    fetchHistory();

    // Subscribe to history changes
    const channel = supabase
      .channel(`status_history_${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "collection_status_history",
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          const newHistory = payload.new as StatusHistory;
          setHistory((prev) => [newHistory, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  // Show toast when status changes
  useEffect(() => {
    if (currentStatus !== previousStatus) {
      toast({
        title: `স্ট্যাটাস আপডেট: ${statusSteps.find((s) => s.status === currentStatus)?.labelBn}`,
        description: statusMessages[currentStatus],
      });
      setPreviousStatus(currentStatus);
    }
  }, [currentStatus, previousStatus, toast]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Current Status Message */}
      <div className="bg-primary/5 rounded-lg p-3 text-center">
        <p className="text-sm text-primary font-medium">
          {statusMessages[currentStatus]}
        </p>
      </div>

      {/* Status Steps */}
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
                    "absolute top-4 sm:top-5 -left-1/2 w-full h-0.5 transition-colors duration-500",
                    index <= currentIndex ? "bg-primary" : "bg-border"
                  )}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Status circle */}
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-300",
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border-2 border-border",
                  isCurrent && "ring-2 sm:ring-4 ring-primary/20 animate-pulse"
                )}
              >
                {isCompleted && !isCurrent ? (
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  "text-[10px] sm:text-xs mt-1 sm:mt-2 text-center font-medium transition-colors max-w-[50px] sm:max-w-none leading-tight",
                  isCompleted ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.labelBn}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status History Collapsible */}
      {history.length > 0 && (
        <Collapsible open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-full justify-between text-muted-foreground">
              <span className="text-xs">স্ট্যাটাস ইতিহাস ({history.length}টি আপডেট)</span>
              {isHistoryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.map((item, index) => {
                const stepInfo = statusSteps.find((s) => s.status === item.status);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 p-2 rounded-lg text-sm",
                      index === 0 ? "bg-primary/5" : "bg-muted/50"
                    )}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {stepInfo && <stepInfo.icon className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">
                        {stepInfo?.labelBn || item.status}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-muted-foreground truncate">{item.notes}</p>
                      )}
                      <p className="text-xs text-muted-foreground/70 mt-0.5">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
