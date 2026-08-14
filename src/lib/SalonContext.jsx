import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient.js";
import { useAuth } from "./AuthContext.jsx";

const SalonContext = createContext(null);

export function SalonProvider({ children }) {
  const { user } = useAuth();
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
    refresh();
  }, [refresh]);

  return (
    <SalonContext.Provider value={{ salon, loading, refresh, setSalon }}>{children}</SalonContext.Provider>
  );
}

export function useSalon() {
  const ctx = useContext(SalonContext);
  if (!ctx) throw new Error("useSalon must be used within SalonProvider");
  return ctx;
}
