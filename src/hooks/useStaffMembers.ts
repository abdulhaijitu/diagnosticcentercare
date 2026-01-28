import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface StaffMember {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
}

export function useStaffMembers() {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        setIsLoading(true);
        
        // Get all users with staff role
        const { data: staffRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "staff");

        if (rolesError) throw rolesError;

        if (staffRoles && staffRoles.length > 0) {
          const staffIds = staffRoles.map((r) => r.user_id);
          
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, email, phone")
            .in("id", staffIds);

          if (profilesError) throw profilesError;
          
          setStaffMembers(profiles || []);
        } else {
          setStaffMembers([]);
        }
      } catch (error) {
        console.error("Error fetching staff members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaffMembers();
  }, []);

  return { staffMembers, isLoading };
}
