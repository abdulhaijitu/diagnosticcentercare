import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Report {
  id: string;
  request_id: string;
  patient_id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  uploaded_by: string;
  uploaded_at: string;
  notes: string | null;
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { user, isAdmin, isStaff } = useAuth();
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setReports((data || []) as Report[]);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const uploadReport = async (
    requestId: string,
    patientId: string,
    file: File,
    notes?: string
  ) => {
    if (!user || (!isAdmin && !isStaff)) {
      toast({
        title: "Error",
        description: "You don't have permission to upload reports",
        variant: "destructive",
      });
      return { error: new Error("Not authorized") };
    }

    try {
      setIsUploading(true);

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${requestId}_${Date.now()}.${fileExt}`;
      const filePath = `${patientId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save report record to database
      const { error: dbError } = await supabase.from("reports").insert({
        request_id: requestId,
        patient_id: patientId,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        uploaded_by: user.id,
        notes,
      });

      if (dbError) throw dbError;

      // Send notification to patient
      await supabase.functions.invoke("send-notification", {
        body: {
          userId: patientId,
          type: "report_ready",
          data: { requestId },
        },
      });

      toast({
        title: "Success",
        description: "Report uploaded successfully!",
      });

      await fetchReports();
      return { error: null };
    } catch (error) {
      console.error("Error uploading report:", error);
      toast({
        title: "Error",
        description: "Failed to upload report",
        variant: "destructive",
      });
      return { error: error as Error };
    } finally {
      setIsUploading(false);
    }
  };

  const getReportUrl = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("reports")
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (error) throw error;
      return data.signedUrl;
    } catch (error) {
      console.error("Error getting report URL:", error);
      toast({
        title: "Error",
        description: "Failed to get report download link",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteReport = async (reportId: string, filePath: string) => {
    if (!user || (!isAdmin && !isStaff)) {
      toast({
        title: "Error",
        description: "You don't have permission to delete reports",
        variant: "destructive",
      });
      return { error: new Error("Not authorized") };
    }

    try {
      // Delete from storage
      await supabase.storage.from("reports").remove([filePath]);

      // Delete from database
      const { error } = await supabase.from("reports").delete().eq("id", reportId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Report deleted successfully!",
      });

      await fetchReports();
      return { error: null };
    } catch (error) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const getReportsForRequest = (requestId: string) => {
    return reports.filter((r) => r.request_id === requestId);
  };

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    isLoading,
    isUploading,
    uploadReport,
    getReportUrl,
    deleteReport,
    getReportsForRequest,
    refetch: fetchReports,
  };
}
