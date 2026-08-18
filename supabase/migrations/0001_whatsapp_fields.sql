-- BeautyFlow migration: WhatsApp integration, Phase 1 (database preparation)
-- Run this once in the Supabase SQL Editor against an existing project that
-- already has supabase/schema.sql applied.
--
-- Safe to re-run: every statement is guarded (IF NOT EXISTS / duplicate
-- checks), and no existing column, row, or RLS policy is touched or
-- dropped. This only adds new nullable columns and new indexes.
--
-- Scope: schema only. No webhook, no application code, no UI change.

-- ---------------------------------------------------------------------------
-- 1. salons: map a WhatsApp Business phone number to the salon that owns it.
--    This is how an inbound webhook payload (which only carries Meta's
--    phone_number_id) will know which salon a message belongs to.
-- ---------------------------------------------------------------------------

alter table public.salons
  add column if not exists whatsapp_phone_number_id text;

-- One WhatsApp number can only belong to one salon. Existing rows all have
-- NULL here (the column is brand new), so this can never conflict with
-- existing data - the partial index only applies once a salon actually
-- connects a number.
create unique index if not exists salons_whatsapp_phone_number_id_key
  on public.salons (whatsapp_phone_number_id)
  where whatsapp_phone_number_id is not null;

-- ---------------------------------------------------------------------------
-- 2. conversations: record WhatsApp's own message id so a retried webhook
--    delivery (Meta retries on timeout/non-2xx) updates/skips instead of
--    inserting a duplicate message.
-- ---------------------------------------------------------------------------

alter table public.conversations
  add column if not exists external_message_id text;

-- Existing rows all have NULL here too (brand new column), so this is safe
-- for the same reason as above - only future WhatsApp-sourced rows are
-- constrained.
create unique index if not exists conversations_external_message_id_key
  on public.conversations (external_message_id)
  where external_message_id is not null;

-- ---------------------------------------------------------------------------
-- 3. leads: support "does a lead for this phone number already exist for
--    this salon" lookups, which the webhook will need for every inbound
--    message (find-or-create).
--
--    customer_phone already exists - no new column needed. What's missing
--    is (a) an index so that lookup is fast, and (b) ideally a uniqueness
--    guarantee so the same phone number can't accidentally end up on two
--    leads for the same salon.
--
--    Unlike the two additions above, customer_phone is an EXISTING column
--    that may already hold data entered by hand (including possible
--    duplicates from manual testing). Adding a hard uniqueness constraint
--    blindly could fail outright on real data, which would break this
--    migration. So this checks for duplicates first:
--      - none found  -> the unique index is created
--      - some found  -> a plain (non-unique) index is created instead, a
--                        NOTICE lists how many duplicate phone numbers
--                        exist, and the exact statement to run later once
--                        they're resolved is printed.
--    Either way the migration completes successfully and no existing row
--    is changed.
-- ---------------------------------------------------------------------------

do $$
declare
  dup_count int;
begin
  select count(*) into dup_count
  from (
    select salon_id, customer_phone
    from public.leads
    where customer_phone is not null and customer_phone <> ''
    group by salon_id, customer_phone
    having count(*) > 1
  ) d;

  if dup_count = 0 then
    if not exists (
      select 1 from pg_indexes
      where schemaname = 'public' and indexname = 'leads_salon_phone_key'
    ) then
      create unique index leads_salon_phone_key
        on public.leads (salon_id, customer_phone)
        where customer_phone is not null and customer_phone <> '';
      raise notice 'leads_salon_phone_key created: (salon_id, customer_phone) is now enforced unique.';
    end if;
  else
    if not exists (
      select 1 from pg_indexes
      where schemaname = 'public' and indexname = 'leads_salon_phone_idx'
    ) then
      create index leads_salon_phone_idx on public.leads (salon_id, customer_phone);
    end if;
    raise notice 'Skipped unique index on leads(salon_id, customer_phone): % duplicate phone number(s) found within the same salon. A plain (non-unique) index was created instead so lookups stay fast. Resolve the duplicates, then run: create unique index leads_salon_phone_key on public.leads (salon_id, customer_phone) where customer_phone is not null and customer_phone <> '''';', dup_count;
  end if;
end $$;
