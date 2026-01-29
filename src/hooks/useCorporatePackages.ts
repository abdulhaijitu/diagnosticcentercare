import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface CorporatePackage {
  id: string;
  name: string;
  name_en: string;
  price: number;
  price_label: string;
  min_employees: number;
  is_popular: boolean;
  description: string | null;
  tests: string[];
  features: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useCorporatePackages() {
  return useQuery({
    queryKey: ["corporate-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("corporate_packages" as any)
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (error) throw error;
      return data as unknown as CorporatePackage[];
    },
  });
}

export function useAllCorporatePackages() {
  return useQuery({
    queryKey: ["corporate-packages", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("corporate_packages" as any)
        .select("*")
        .order("sort_order");

      if (error) throw error;
      return data as unknown as CorporatePackage[];
    },
  });
}

export function useCorporatePackageMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createPackage = useMutation({
    mutationFn: async (data: Omit<CorporatePackage, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("corporate_packages" as any)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-packages"] });
      toast({ title: "প্যাকেজ তৈরি হয়েছে" });
    },
    onError: () => {
      toast({ title: "সমস্যা হয়েছে", variant: "destructive" });
    },
  });

  const updatePackage = useMutation({
    mutationFn: async ({ id, ...data }: Partial<CorporatePackage> & { id: string }) => {
      const { data: result, error } = await supabase
        .from("corporate_packages" as any)
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-packages"] });
      toast({ title: "প্যাকেজ আপডেট হয়েছে" });
    },
    onError: () => {
      toast({ title: "সমস্যা হয়েছে", variant: "destructive" });
    },
  });

  const deletePackage = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("corporate_packages" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-packages"] });
      toast({ title: "প্যাকেজ মুছে ফেলা হয়েছে" });
    },
    onError: () => {
      toast({ title: "সমস্যা হয়েছে", variant: "destructive" });
    },
  });

  return { createPackage, updatePackage, deletePackage };
}