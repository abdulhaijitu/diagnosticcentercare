import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string | null;
  experience_years: number | null;
  consultation_fee: number;
  available_days: string[];
  available_from: string;
  available_to: string;
  slot_duration: number;
  max_patients_per_slot: number;
  avatar_url: string | null;
  bio: string | null;
  is_active: boolean;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  patient_name: string;
  patient_phone: string;
  patient_email: string | null;
  reason: string | null;
  notes: string | null;
  created_at: string;
  doctor?: Doctor;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Use raw query since types may not be updated yet
        const { data, error } = await supabase
          .from("doctors" as any)
          .select("*")
          .eq("is_active", true)
          .order("name");

        if (error) throw error;
        setDoctors((data || []) as unknown as Doctor[]);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, isLoading };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAdmin, isStaff } = useAuth();
  const { toast } = useToast();

  const fetchAppointments = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Use raw query since types may not be updated yet
      const { data, error } = await supabase
        .from("appointments" as any)
        .select(`
          *,
          doctor:doctors(*)
        `)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) throw error;
      setAppointments((data || []) as unknown as Appointment[]);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const createAppointment = async (appointmentData: {
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    patient_name: string;
    patient_phone: string;
    patient_email?: string;
    reason?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase
        .from("appointments" as any)
        .insert({
          patient_id: user.id,
          ...appointmentData,
        })
        .select(`
          *,
          doctor:doctors(*)
        `)
        .single();

      if (error) throw error;

      const appointment = data as unknown as Appointment;

      // Send notification
      try {
        await supabase.functions.invoke("send-notification", {
          body: {
            userId: user.id,
            type: "appointment_confirmed",
            data: {
              doctor_name: appointment.doctor?.name,
              date: appointmentData.appointment_date,
              time: appointmentData.appointment_time,
            },
          },
        });
      } catch (notifError) {
        console.error("Failed to send notification:", notifError);
      }

      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully scheduled.",
      });

      await fetchAppointments();
      return { data: appointment, error: null };
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const cancelAppointment = async (appointmentId: string, reason?: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { error } = await supabase
        .from("appointments" as any)
        .update({
          status: "cancelled",
          cancelled_by: user.id,
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq("id", appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled.",
      });

      await fetchAppointments();
      return { error: null };
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
      return { error: error as Error };
    }
  };

  const getBookedSlots = async (doctorId: string, date: string) => {
    try {
      const { data, error } = await supabase
        .from("appointments" as any)
        .select("appointment_time")
        .eq("doctor_id", doctorId)
        .eq("appointment_date", date)
        .neq("status", "cancelled");

      if (error) throw error;
      return ((data || []) as unknown as { appointment_time: string }[]).map((a) => a.appointment_time);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);

  return {
    appointments,
    isLoading,
    createAppointment,
    cancelAppointment,
    getBookedSlots,
    refetch: fetchAppointments,
  };
}

// Generate time slots based on doctor's availability
export function generateTimeSlots(
  availableFrom: string,
  availableTo: string,
  slotDuration: number
): string[] {
  const slots: string[] = [];
  const [fromHour, fromMin] = availableFrom.split(":").map(Number);
  const [toHour, toMin] = availableTo.split(":").map(Number);

  let currentMinutes = fromHour * 60 + fromMin;
  const endMinutes = toHour * 60 + toMin;

  while (currentMinutes + slotDuration <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    );
    currentMinutes += slotDuration;
  }

  return slots;
}
