import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
  id: string;
  name: string;
  name_bn: string | null;
  location: string;
  location_bn: string | null;
  rating: number;
  text: string;
  text_bn: string | null;
  service: string;
  service_bn: string | null;
  is_active: boolean;
  sort_order: number;
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });
}
