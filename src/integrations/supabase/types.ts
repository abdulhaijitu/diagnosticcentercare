export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_time: string
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          created_at: string
          doctor_id: string
          id: string
          notes: string | null
          patient_email: string | null
          patient_id: string
          patient_name: string
          patient_phone: string
          reason: string | null
          status: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          doctor_id: string
          id?: string
          notes?: string | null
          patient_email?: string | null
          patient_id: string
          patient_name: string
          patient_phone: string
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          created_at?: string
          doctor_id?: string
          id?: string
          notes?: string | null
          patient_email?: string | null
          patient_id?: string
          patient_name?: string
          patient_phone?: string
          reason?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          id: string
          notes: string | null
          request_id: string
          status: Database["public"]["Enums"]["collection_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_id: string
          status: Database["public"]["Enums"]["collection_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["collection_status"]
        }
        Relationships: [
          {
            foreignKeyName: "collection_status_history_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "home_collection_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      corporate_inquiries: {
        Row: {
          company_name: string
          contact_person: string
          created_at: string
          email: string
          employee_count: string
          id: string
          message: string | null
          phone: string
          preferred_package: string
          responded_at: string | null
          responded_by: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_person: string
          created_at?: string
          email: string
          employee_count: string
          id?: string
          message?: string | null
          phone: string
          preferred_package: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_person?: string
          created_at?: string
          email?: string
          employee_count?: string
          id?: string
          message?: string | null
          phone?: string
          preferred_package?: string
          responded_at?: string | null
          responded_by?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      corporate_packages: {
        Row: {
          created_at: string
          description: string | null
          features: string[]
          id: string
          is_active: boolean
          is_popular: boolean
          min_employees: number
          name: string
          name_en: string
          price: number
          price_label: string
          sort_order: number
          tests: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean
          is_popular?: boolean
          min_employees?: number
          name: string
          name_en: string
          price?: number
          price_label?: string
          sort_order?: number
          tests?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: string[]
          id?: string
          is_active?: boolean
          is_popular?: boolean
          min_employees?: number
          name?: string
          name_en?: string
          price?: number
          price_label?: string
          sort_order?: number
          tests?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      diagnostic_tests: {
        Row: {
          category: string
          category_bn: string | null
          created_at: string
          description: string | null
          description_bn: string | null
          discounted_price: number | null
          id: string
          is_active: boolean
          is_popular: boolean
          name: string
          name_bn: string | null
          preparation: string | null
          preparation_bn: string | null
          price: number
          report_time: string | null
          report_time_bn: string | null
          sample_type: string | null
          sample_type_bn: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          category: string
          category_bn?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          discounted_price?: number | null
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name: string
          name_bn?: string | null
          preparation?: string | null
          preparation_bn?: string | null
          price?: number
          report_time?: string | null
          report_time_bn?: string | null
          sample_type?: string | null
          sample_type_bn?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string
          category_bn?: string | null
          created_at?: string
          description?: string | null
          description_bn?: string | null
          discounted_price?: number | null
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name?: string
          name_bn?: string | null
          preparation?: string | null
          preparation_bn?: string | null
          price?: number
          report_time?: string | null
          report_time_bn?: string | null
          sample_type?: string | null
          sample_type_bn?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctor_education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          doctor_id: string
          id: string
          institution: string
          year: number | null
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          doctor_id: string
          id?: string
          institution: string
          year?: number | null
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          doctor_id?: string
          id?: string
          institution?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "doctor_education_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_experience: {
        Row: {
          created_at: string
          description: string | null
          doctor_id: string
          end_year: number | null
          id: string
          is_current: boolean
          organization: string
          position: string
          start_year: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          doctor_id: string
          end_year?: number | null
          id?: string
          is_current?: boolean
          organization: string
          position: string
          start_year: number
        }
        Update: {
          created_at?: string
          description?: string | null
          doctor_id?: string
          end_year?: number | null
          id?: string
          is_current?: boolean
          organization?: string
          position?: string
          start_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "doctor_experience_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctors: {
        Row: {
          available_days: string[]
          available_from: string
          available_to: string
          avatar_url: string | null
          bio: string | null
          consultation_fee: number
          created_at: string
          experience_years: number | null
          id: string
          is_active: boolean
          max_patients_per_slot: number
          name: string
          qualification: string | null
          slot_duration: number
          specialty: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          available_days?: string[]
          available_from?: string
          available_to?: string
          avatar_url?: string | null
          bio?: string | null
          consultation_fee?: number
          created_at?: string
          experience_years?: number | null
          id?: string
          is_active?: boolean
          max_patients_per_slot?: number
          name: string
          qualification?: string | null
          slot_duration?: number
          specialty: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          available_days?: string[]
          available_from?: string
          available_to?: string
          avatar_url?: string | null
          bio?: string | null
          consultation_fee?: number
          created_at?: string
          experience_years?: number | null
          id?: string
          is_active?: boolean
          max_patients_per_slot?: number
          name?: string
          qualification?: string | null
          slot_duration?: number
          specialty?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      home_collection_requests: {
        Row: {
          address: string
          assigned_at: string | null
          assigned_by: string | null
          assigned_staff_id: string | null
          created_at: string
          email: string | null
          full_name: string
          id: string
          notes: string | null
          patient_id: string
          phone: string
          preferred_date: string
          preferred_time: string
          status: Database["public"]["Enums"]["collection_status"]
          test_names: string[]
          total_amount: number
          updated_at: string
        }
        Insert: {
          address: string
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_staff_id?: string | null
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          notes?: string | null
          patient_id: string
          phone: string
          preferred_date: string
          preferred_time: string
          status?: Database["public"]["Enums"]["collection_status"]
          test_names: string[]
          total_amount: number
          updated_at?: string
        }
        Update: {
          address?: string
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_staff_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          patient_id?: string
          phone?: string
          preferred_date?: string
          preferred_time?: string
          status?: Database["public"]["Enums"]["collection_status"]
          test_names?: string[]
          total_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      notification_logs: {
        Row: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          delivered_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          notification_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          notification_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          notification_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          email_enabled: boolean
          id: string
          in_app_enabled: boolean
          notification_type: Database["public"]["Enums"]["notification_type"]
          sms_enabled: boolean
          template_message: string | null
          template_title: string | null
          updated_at: string
          updated_by: string | null
          whatsapp_enabled: boolean
        }
        Insert: {
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          notification_type: Database["public"]["Enums"]["notification_type"]
          sms_enabled?: boolean
          template_message?: string | null
          template_title?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp_enabled?: boolean
        }
        Update: {
          email_enabled?: boolean
          id?: string
          in_app_enabled?: boolean
          notification_type?: Database["public"]["Enums"]["notification_type"]
          sms_enabled?: boolean
          template_message?: string | null
          template_title?: string | null
          updated_at?: string
          updated_by?: string | null
          whatsapp_enabled?: boolean
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channels: Database["public"]["Enums"]["notification_channel"][] | null
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          notes: string | null
          patient_id: string
          request_id: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          request_id: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          request_id?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "home_collection_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_logs: {
        Row: {
          created_at: string
          id: string
          message: string
          phone: string
          provider: string
          response: Json | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          phone: string
          provider?: string
          response?: Json | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          phone?: string
          provider?: string
          response?: Json | null
          status?: string
        }
        Relationships: []
      }
      specialty_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          is_active: boolean
          location: string
          location_bn: string | null
          name: string
          name_bn: string | null
          rating: number
          service: string
          service_bn: string | null
          sort_order: number
          text: string
          text_bn: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location: string
          location_bn?: string | null
          name: string
          name_bn?: string | null
          rating?: number
          service: string
          service_bn?: string | null
          sort_order?: number
          text: string
          text_bn?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          location?: string
          location_bn?: string | null
          name?: string
          name_bn?: string | null
          rating?: number
          service?: string
          service_bn?: string | null
          sort_order?: number
          text?: string
          text_bn?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_logs: {
        Row: {
          created_at: string
          id: string
          message: string
          phone: string
          response: Json | null
          status: string
          template_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          phone: string
          response?: Json | null
          status?: string
          template_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          phone?: string
          response?: Json | null
          status?: string
          template_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_manager: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "doctor"
        | "manager"
        | "sales"
        | "staff"
        | "patient"
      collection_status:
        | "requested"
        | "assigned"
        | "collected"
        | "processing"
        | "ready"
      notification_channel: "in_app" | "sms" | "whatsapp" | "email"
      notification_type:
        | "booking_confirmed"
        | "sample_assigned"
        | "sample_collected"
        | "processing_started"
        | "report_ready"
        | "appointment_confirmed"
        | "appointment_cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "doctor",
        "manager",
        "sales",
        "staff",
        "patient",
      ],
      collection_status: [
        "requested",
        "assigned",
        "collected",
        "processing",
        "ready",
      ],
      notification_channel: ["in_app", "sms", "whatsapp", "email"],
      notification_type: [
        "booking_confirmed",
        "sample_assigned",
        "sample_collected",
        "processing_started",
        "report_ready",
        "appointment_confirmed",
        "appointment_cancelled",
      ],
    },
  },
} as const
