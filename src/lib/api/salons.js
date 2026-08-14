import { supabase } from "../supabaseClient.js";

export async function createSalon({ ownerId, name, phone }) {
  return supabase
    .from("salons")
    .insert({ owner_id: ownerId, name, phone })
    .select()
    .single();
}

export async function updateSalon(salonId, fields) {
  return supabase.from("salons").update(fields).eq("id", salonId).select().single();
}

export async function listServices(salonId) {
  return supabase
    .from("salon_services")
    .select("id, name, price, created_at")
    .eq("salon_id", salonId)
    .order("created_at", { ascending: true });
}

export async function addServices(salonId, services) {
  if (!services.length) return { data: [], error: null };
  return supabase
    .from("salon_services")
    .insert(services.map((s) => ({ salon_id: salonId, name: s.name, price: s.price })))
    .select();
}
