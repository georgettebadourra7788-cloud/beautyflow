import { supabase } from "../supabaseClient.js";

export async function listMessages(leadId) {
  return supabase
    .from("conversations")
    .select("id, salon_id, lead_id, channel, message, sender_type, created_at")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: true });
}

export async function sendMessage({ salonId, leadId, message, senderType = "salon", channel = "manual" }) {
  return supabase
    .from("conversations")
    .insert({ salon_id: salonId, lead_id: leadId, message, sender_type: senderType, channel })
    .select()
    .single();
}

export async function createFollowUp({ salonId, leadId, message }) {
  return supabase
    .from("follow_ups")
    .insert({
      salon_id: salonId,
      lead_id: leadId,
      message,
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .select()
    .single();
}
