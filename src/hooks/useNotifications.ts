import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type NotificationType =
  | "booking_confirmed"
  | "sample_assigned"
  | "sample_collected"
  | "processing_started"
  | "report_ready";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  channels: string[];
  read_at: string | null;
  created_at: string;
}

export interface NotificationSettings {
  id: string;
  notification_type: NotificationType;
  in_app_enabled: boolean;
  sms_enabled: boolean;
  whatsapp_enabled: boolean;
  email_enabled: boolean;
  template_title: string | null;
  template_message: string | null;
  updated_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const notifs = (data || []) as Notification[];
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read_at).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from("notifications")
          .update({ read_at: new Date().toISOString() })
          .eq("id", notificationId)
          .eq("user_id", user.id);

        if (error) throw error;

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read_at: new Date().toISOString() } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [user]
  );

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .is("read_at", null);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [user]);

  // Send notification via edge function
  const sendNotification = useCallback(
    async (
      userId: string,
      type: NotificationType,
      data: Record<string, unknown>
    ) => {
      try {
        const { error } = await supabase.functions.invoke("send-notification", {
          body: { userId, type, data },
        });

        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error("Error sending notification:", error);
        return { error };
      }
    },
    []
  );

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channel = supabase
      .channel("notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Show toast for new notifications
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchNotifications, toast]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    sendNotification,
    refetch: fetchNotifications,
  };
}

// Hook for admin notification settings
export function useNotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .order("notification_type");

      if (error) throw error;
      setSettings((data || []) as NotificationSettings[]);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSetting = useCallback(
    async (
      notificationType: NotificationType,
      updates: Partial<NotificationSettings>
    ) => {
      if (!user || !isAdmin) return { error: new Error("Not authorized") };

      try {
        const { error } = await supabase
          .from("notification_settings")
          .update({
            ...updates,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq("notification_type", notificationType);

        if (error) throw error;

        toast({
          title: "Settings Updated",
          description: "Notification settings have been saved.",
        });

        await fetchSettings();
        return { error: null };
      } catch (error) {
        console.error("Error updating settings:", error);
        toast({
          title: "Error",
          description: "Failed to update settings",
          variant: "destructive",
        });
        return { error };
      }
    },
    [user, isAdmin, fetchSettings, toast]
  );

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    updateSetting,
    refetch: fetchSettings,
  };
}
