import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  responded_at: string | null;
  responded_by: string | null;
  created_at: string;
}

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchMessages = useCallback(async () => {
    if (!user || !isAdmin) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, isAdmin, toast]);

  const updateMessageStatus = async (messageId: string, status: string) => {
    if (!user || !isAdmin) return { error: new Error("Not authorized") };

    try {
      const updateData: { status: string; responded_at?: string; responded_by?: string } = { status };
      
      if (status === "responded") {
        updateData.responded_at = new Date().toISOString();
        updateData.responded_by = user.id;
      }

      const { error } = await supabase
        .from("contact_messages")
        .update(updateData)
        .eq("id", messageId);

      if (error) throw error;

      toast({
        title: "সফল",
        description: "স্ট্যাটাস আপডেট হয়েছে",
      });

      await fetchMessages();
      return { error: null };
    } catch (error) {
      console.error("Error updating message status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!user || !isAdmin) return { error: new Error("Not authorized") };

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", messageId);

      if (error) throw error;

      toast({
        title: "সফল",
        description: "মেসেজ ডিলিট হয়েছে",
      });

      await fetchMessages();
      return { error: null };
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchMessages();
    }
  }, [user, isAdmin, fetchMessages]);

  return {
    messages,
    isLoading,
    updateMessageStatus,
    deleteMessage,
    refetch: fetchMessages,
  };
}
