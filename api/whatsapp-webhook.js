import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

// This runs as a Vercel Function (Node.js), never in the browser bundle -
// it's the only place that's allowed to hold the Supabase service-role key
// and the WhatsApp app secret. Nothing here is reachable from src/.

// Disable Vercel's automatic JSON body parsing: WhatsApp's signature
// (X-Hub-Signature-256) is computed over the exact raw request bytes, so we
// have to read and verify the raw body ourselves before trusting it enough
// to JSON.parse.
export const config = {
  api: { bodyParser: false },
};

const SERVICE_TYPE_PLACEHOLDER = {
  image: "[Image message - media not yet supported]",
  video: "[Video message - media not yet supported]",
  audio: "[Voice message - media not yet supported]",
  document: "[Document - media not yet supported]",
  sticker: "[Sticker - media not yet supported]",
  location: "[Location shared - not yet supported]",
  contacts: "[Contact card shared - not yet supported]",
};

function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is not configured (missing URL or SUPABASE_SERVICE_ROLE_KEY).");
  }
  // service-role key bypasses RLS by design - this is the one place in the
  // whole app that's allowed to do that, because there is no logged-in user
  // for an inbound webhook call to authenticate as.
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function isValidSignature(rawBody, signatureHeader, appSecret) {
  if (!signatureHeader || !appSecret) return false;
  const expected =
    "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const provided = Buffer.from(signatureHeader);
  const expectedBuf = Buffer.from(expected);
  if (provided.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(provided, expectedBuf);
}

// Meta sends the customer's number as digits only (e.g. "15551234567").
// Leads created by hand through the app can be in any format, but every
// lead this webhook creates going forward uses this same normalized form,
// so future messages from the same number keep matching correctly.
function normalizePhone(rawFrom) {
  const digits = String(rawFrom || "").replace(/[^\d]/g, "");
  return digits ? `+${digits}` : null;
}

async function findOrCreateLead(supabaseAdmin, { salonId, phone, contactName }) {
  const { data: existing, error: findError } = await supabaseAdmin
    .from("leads")
    .select("id")
    .eq("salon_id", salonId)
    .eq("customer_phone", phone)
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) return existing.id;

  const { data: created, error: insertError } = await supabaseAdmin
    .from("leads")
    .insert({
      salon_id: salonId,
      customer_name: contactName || phone,
      customer_phone: phone,
      source: "whatsapp",
      status: "new",
    })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return created.id;
}

async function processMessage(supabaseAdmin, { salonId, contactName, message }) {
  const phone = normalizePhone(message.from);
  if (!phone) return;

  const leadId = await findOrCreateLead(supabaseAdmin, { salonId, phone, contactName });

  const text =
    message.type === "text"
      ? message.text?.body ?? ""
      : SERVICE_TYPE_PLACEHOLDER[message.type] ?? `[Unsupported message type: ${message.type}]`;

  // upsert on the external_message_id unique index (added in the Phase 1
  // migration) - if Meta retries the same delivery, this is a no-op instead
  // of a duplicate row.
  const { error: insertMsgError } = await supabaseAdmin.from("conversations").upsert(
    {
      salon_id: salonId,
      lead_id: leadId,
      channel: "whatsapp",
      message: text,
      sender_type: "customer",
      external_message_id: message.id,
    },
    { onConflict: "external_message_id", ignoreDuplicates: true }
  );
  if (insertMsgError) throw insertMsgError;

  const { error: touchError } = await supabaseAdmin
    .from("leads")
    .update({ last_contact_at: new Date().toISOString() })
    .eq("id", leadId);
  if (touchError) throw touchError;
}

async function handleVerification(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    return;
  }
  res.status(403).send("Forbidden");
}

async function handleIncoming(req, res) {
  const rawBody = await readRawBody(req);
  const signature = req.headers["x-hub-signature-256"];

  if (!isValidSignature(rawBody, signature, process.env.WHATSAPP_APP_SECRET)) {
    res.status(401).json({ error: "Invalid signature" });
    return;
  }

  let payload;
  try {
    payload = JSON.parse(rawBody.toString("utf8"));
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  // Always ack fast once the signature is trusted - Meta retries
  // aggressively on anything other than a quick 2xx, and per-message
  // failures below are caught and logged individually rather than turned
  // into a failing response.
  res.status(200).json({ received: true });

  let supabaseAdmin;
  try {
    supabaseAdmin = getSupabaseAdmin();
  } catch (err) {
    console.error("[whatsapp-webhook] Supabase admin client unavailable:", err.message);
    return;
  }

  const entries = payload.entry ?? [];
  for (const entry of entries) {
    for (const change of entry.changes ?? []) {
      const value = change.value ?? {};
      const phoneNumberId = value.metadata?.phone_number_id;
      const messages = value.messages ?? [];
      if (!phoneNumberId || messages.length === 0) continue; // e.g. a status/read-receipt update, not a message

      let salonId;
      try {
        const { data: salon, error } = await supabaseAdmin
          .from("salons")
          .select("id")
          .eq("whatsapp_phone_number_id", phoneNumberId)
          .maybeSingle();
        if (error) throw error;
        salonId = salon?.id;
      } catch (err) {
        console.error("[whatsapp-webhook] Failed to look up salon for phone_number_id", phoneNumberId, err);
        continue;
      }

      if (!salonId) {
        console.warn("[whatsapp-webhook] No salon connected to WhatsApp phone_number_id", phoneNumberId);
        continue;
      }

      const contactName = value.contacts?.[0]?.profile?.name;

      for (const message of messages) {
        try {
          await processMessage(supabaseAdmin, { salonId, contactName, message });
        } catch (err) {
          console.error("[whatsapp-webhook] Failed to process message", message.id, err);
        }
      }
    }
  }
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    await handleVerification(req, res);
    return;
  }
  if (req.method === "POST") {
    await handleIncoming(req, res);
    return;
  }
  res.status(405).json({ error: "Method not allowed" });
}
