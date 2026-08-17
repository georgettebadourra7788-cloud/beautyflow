import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient.js";
import { useAuth } from "./AuthContext.jsx";

const SalonContext = createContext(null);

export function SalonProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setSalon(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("salons")
      .select("id, owner_id, name, phone, address, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    setSalon(data ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    // Wait for AuthContext to confirm the real auth state before acting on
    // `user`. On first load, `user` is transiently null while auth is still
    // checking the session - resolving "no salon" at that point (instead of
    // waiting) leaves stale loading:false/salon:null state that route
    // guards can read the instant auth finishes, sending logged-in owners
    // to onboarding before the real salon fetch even starts.
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  return (
    <SalonContext.Provider value={{ salon, loading, refresh, setSalon }}>{children}</SalonContext.Provider>
  );
}

export function useSalon() {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error("useSalon must be used within SalonProvider");
  return ctx;
}
