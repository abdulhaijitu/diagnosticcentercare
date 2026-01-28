import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type CollectionStatus = "requested" | "assigned" | "collected" | "processing" | "ready";

export interface HomeCollectionRequest {
  id: string;
  patient_id: string;
  test_names: string[];
  total_amount: number;
  full_name: string;
  phone: string;
  email: string | null;
  address: string;
  preferred_date: string;
  preferred_time: string;
  status: CollectionStatus;
  assigned_staff_id: string | null;
  assigned_at: string | null;
  assigned_by: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatusHistory {
  id: string;
  request_id: string;
  status: CollectionStatus;
  changed_by: string | null;
  notes: string | null;
  created_at: string;
}

export function useHomeCollectionRequests() {
  const [requests, setRequests] = useState<HomeCollectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin, isStaff } = useAuth();
  const { toast } = useToast();

  // Send notification helper
  const sendNotification = useCallback(
    async (
      userId: string,
      type: "booking_confirmed" | "sample_assigned" | "sample_collected" | "processing_started" | "report_ready",
      data: Record<string, unknown>
    ) => {
      try {
        await supabase.functions.invoke("send-notification", {
          body: { userId, type, data },
        });
      } catch (error) {
        console.error("Failed to send notification:", error);
      }
    },
    []
  );

  const fetchRequests = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("home_collection_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data || []) as HomeCollectionRequest[]);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load home collection requests",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRequest = async (requestData: {
    test_names: string[];
    total_amount: number;
    full_name: string;
    phone: string;
    email?: string;
    address: string;
    preferred_date: string;
    preferred_time: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data: newRequest, error } = await supabase
        .from("home_collection_requests")
        .insert({
          patient_id: user.id,
          ...requestData,
        })
        .select()
        .single();

      if (error) throw error;

      // Send booking confirmation notification
      await sendNotification(user.id, "booking_confirmed", {
        requestId: newRequest.id,
        testNames: requestData.test_names,
        date: requestData.preferred_date,
        time: requestData.preferred_time,
      });

      toast({
        title: "Success",
        description: "Home collection request submitted successfully!",
      });

      await fetchRequests();
      return { error: null };
    } catch (error) {
      console.error("Error creating request:", error);
      toast({
        title: "Error",
        description: "Failed to submit home collection request",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    status: CollectionStatus,
    notes?: string
  ) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      // Get the request first to know the patient_id
      const { data: request } = await supabase
        .from("home_collection_requests")
        .select("patient_id, test_names, preferred_date, preferred_time")
        .eq("id", requestId)
        .single();

      const { error: updateError } = await supabase
        .from("home_collection_requests")
        .update({ status, notes })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // Add to status history
      await supabase.from("collection_status_history").insert({
        request_id: requestId,
        status,
        changed_by: user.id,
        notes,
      });

      // Send notification based on status
      if (request) {
        const notificationTypeMap: Record<CollectionStatus, "sample_assigned" | "sample_collected" | "processing_started" | "report_ready" | null> = {
          requested: null,
          assigned: "sample_assigned",
          collected: "sample_collected",
          processing: "processing_started",
          ready: "report_ready",
        };

        const notificationType = notificationTypeMap[status];
        if (notificationType) {
          await sendNotification(request.patient_id, notificationType, {
            requestId,
            testNames: request.test_names,
            date: request.preferred_date,
            time: request.preferred_time,
          });
        }
      }

      toast({
        title: "Success",
        description: "Status updated successfully!",
      });

      await fetchRequests();
      return { error: null };
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const assignStaff = async (requestId: string, staffId: string) => {
    if (!user || !isAdmin) return { error: new Error("Not authorized") };

    try {
      const { error } = await supabase
        .from("home_collection_requests")
        .update({
          assigned_staff_id: staffId,
          assigned_at: new Date().toISOString(),
          assigned_by: user.id,
          status: "assigned",
        })
        .eq("id", requestId);

      if (error) throw error;

      // Add to status history
      await supabase.from("collection_status_history").insert({
        request_id: requestId,
        status: "assigned",
        changed_by: user.id,
        notes: `Assigned to staff`,
      });

      toast({
        title: "Success",
        description: "Staff assigned successfully!",
      });

      await fetchRequests();
      return { error: null };
    } catch (error) {
      console.error("Error assigning staff:", error);
      toast({
        title: "Error",
        description: "Failed to assign staff",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const reschedule = async (
    requestId: string,
    newDate: string,
    newTime: string
  ) => {
    if (!user || !isAdmin) return { error: new Error("Not authorized") };

    try {
      const { error } = await supabase
        .from("home_collection_requests")
        .update({
          preferred_date: newDate,
          preferred_time: newTime,
        })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Request rescheduled successfully!",
      });

      await fetchRequests();
      return { error: null };
    } catch (error) {
      console.error("Error rescheduling:", error);
      toast({
        title: "Error",
        description: "Failed to reschedule",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchRequests();

    const channel = supabase
      .channel("home_collection_requests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "home_collection_requests",
        },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    requests,
    isLoading,
    createRequest,
    updateRequestStatus,
    assignStaff,
    reschedule,
    refetch: fetchRequests,
  };
}
