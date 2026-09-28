import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("*, company_brand_settings(*)");
      if (error) throw error;
      return data;
    },
  });
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useModules(courseId: string) {
  return useQuery({
    queryKey: ["modules", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("modules")
        .select("*")
        .eq("course_id", courseId)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });
}

export function useQuizzes() {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*, courses(title)");
      if (error) throw error;
      return data;
    },
  });
}

export function useUsers() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["users", user?.companyId],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*, user_roles(role)");
      if (user?.role === "company_admin" && user.companyId) {
        query = query.eq("company_id", user.companyId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useEnrollments(userId?: string) {
  return useQuery({
    queryKey: ["enrollments", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("*, courses(*)")
        .eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useProgress(userId?: string) {
  return useQuery({
    queryKey: ["progress", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_tracking")
        .select("*")
        .eq("user_id", userId!);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useCompanyBrand(companyId?: string | null) {
  return useQuery({
    queryKey: ["company-brand", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_brand_settings")
        .select("*")
        .eq("company_id", companyId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!companyId,
  });
}
