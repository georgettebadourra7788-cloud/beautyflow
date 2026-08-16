import { supabase } from "../supabaseClient.js";

export async function listLeads(salonId) {
  return supabase
    .from("leads")
    .select(
      "id, customer_name, customer_phone, customer_email, service, source, status, potential_value, last_contact_at, created_at"
    )
    .eq("salon_id", salonId)
    .order("created_at", { ascending: false });
}

export async function getLead(leadId) {
  return supabase
    .from("leads")
    .select(
      "id, salon_id, customer_name, customer_phone, customer_email, service, source, status, potential_value, last_contact_at, created_at"
    )
    .eq("id", leadId)
    .maybeSingle();
}

export async function createLead(salonId, lead) {
  return supabase
    .from("leads")
    .insert({
      salon_id: salonId,
      customer_name: lead.customerName,
      customer_phone: lead.customerPhone || null,
      service: lead.service || null,
      source: lead.source || "manual",
      potential_value: lead.potentialValue ?? null,
      status: lead.status || "new",
      last_contact_at: lead.lastContactAt || null,
    })
    .select()
    .single();
}

export async function updateLead(leadId, lead) {
  return supabase
    .from("leads")
    .update({
      customer_name: lead.customerName,
      customer_phone: lead.customerPhone || null,
      service: lead.service || null,
      source: lead.source || "manual",
      potential_value: lead.potentialValue ?? null,
      status: lead.status || "new",
      last_contact_at: lead.lastContactAt || null,
    })
    .eq("id", leadId)
    .select()
    .single();
}

export async function deleteLead(leadId) {
  return supabase.from("leads").delete().eq("id", leadId);
}

export async function updateLeadStatus(leadId, status) {
  return supabase
    .from("leads")
    .update({ status, last_contact_at: new Date().toISOString() })
    .eq("id", leadId)
    .select()
    .single();
}
