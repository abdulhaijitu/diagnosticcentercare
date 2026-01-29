import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DiagnosticTest {
  id: string;
  name: string;
  name_bn: string | null;
  slug: string;
  category: string;
  category_bn: string | null;
  description: string | null;
  description_bn: string | null;
  price: number;
  discounted_price: number | null;
  sample_type: string | null;
  sample_type_bn: string | null;
  preparation: string | null;
  preparation_bn: string | null;
  report_time: string | null;
  report_time_bn: string | null;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useDiagnosticTests() {
  return useQuery({
    queryKey: ["diagnostic-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diagnostic_tests")
        .select("*")
        .order("is_popular", { ascending: false })
        .order("name");

      if (error) throw error;
      return data as DiagnosticTest[];
    },
  });
}

export function useDiagnosticTest(slug: string) {
  return useQuery({
    queryKey: ["diagnostic-test", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diagnostic_tests")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      return data as DiagnosticTest | null;
    },
    enabled: !!slug,
  });
}

export function useDiagnosticTestsByCategory(category?: string) {
  return useQuery({
    queryKey: ["diagnostic-tests", "category", category],
    queryFn: async () => {
      let query = supabase.from("diagnostic_tests").select("*");
      
      if (category) {
        query = query.eq("category", category);
      }
      
      const { data, error } = await query
        .order("is_popular", { ascending: false })
        .order("name");

      if (error) throw error;
      return data as DiagnosticTest[];
    },
  });
}

export function useTestCategories() {
  return useQuery({
    queryKey: ["test-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("diagnostic_tests")
        .select("category, category_bn")
        .order("category");

      if (error) throw error;
      
      // Get unique categories
      const uniqueCategories = Array.from(
        new Map(data.map(item => [item.category, item])).values()
      );
      
      return uniqueCategories;
    },
  });
}
