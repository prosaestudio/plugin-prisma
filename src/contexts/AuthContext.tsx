import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "super_admin" | "company_admin" | "learner";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string | null;
  companyName?: string | null;
  avatarUrl?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchAppUser(supabaseUser: SupabaseUser): Promise<AppUser> {
  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, company_id, avatar_url, email")
    .eq("user_id", supabaseUser.id)
    .single();

  // Get role
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", supabaseUser.id)
    .order("role");

  // Get company name if applicable
  let companyName: string | null = null;
  if (profile?.company_id) {
    const { data: company } = await supabase
      .from("companies")
      .select("name")
      .eq("id", profile.company_id)
      .single();
    companyName = company?.name || null;
  }

  return {
    id: supabaseUser.id,
    email: profile?.email || supabaseUser.email || "",
    name: profile?.full_name || supabaseUser.user_metadata?.full_name || supabaseUser.email || "",
    role: (roleData?.[0]?.role as UserRole) || "learner",
    companyId: profile?.company_id,
    companyName,
    avatarUrl: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = React.useRef(false);

  useEffect(() => {
    let isCancelled = false;

    const getFallbackUser = (supabaseUser: SupabaseUser): AppUser => ({
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email || "",
      role: "learner",
      companyId: null,
      companyName: null,
      avatarUrl: supabaseUser.user_metadata?.avatar_url || null,
    });

    const syncSessionUser = async (supabaseUser: SupabaseUser | null) => {
      if (isCancelled) return;

      if (!supabaseUser) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const appUser = await fetchAppUser(supabaseUser);
        if (!isCancelled) setUser(appUser);
      } catch {
        if (!isCancelled) setUser(getFallbackUser(supabaseUser));
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Skip INITIAL_SESSION — handled by getSession below
        if (event === "INITIAL_SESSION") return;

        void syncSessionUser(session?.user ?? null);
      }
    );

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      void syncSessionUser(session?.user ?? null);
    });

    return () => {
      isCancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  }, []);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const appUser = await fetchAppUser(session.user);
      setUser(appUser);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
