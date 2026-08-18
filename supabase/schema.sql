-- BeautyFlow database schema
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  phone text,
  address text,
  -- Meta's WhatsApp Business phone number id, used to route an inbound
  -- webhook payload to the salon it belongs to.
  whatsapp_phone_number_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.salon_services (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  name text not null,
  price numeric,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  customer_name text not null,
  customer_phone text,
  customer_email text,
  service text,
  source text default 'manual' check (source in ('instagram', 'whatsapp', 'website', 'manual')),
  status text not null default 'new' check (status in ('new', 'follow_up', 'booked', 'lost')),
  potential_value numeric,
  last_contact_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  channel text default 'manual' check (channel in ('instagram', 'whatsapp', 'website', 'manual')),
  message text not null,
  sender_type text not null check (sender_type in ('customer', 'salon')),
  -- WhatsApp's own message id, so a retried webhook delivery can be
  -- recognized instead of inserted as a duplicate message.
  external_message_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references public.salons (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'cancelled')),
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists salons_owner_id_idx on public.salons (owner_id);
create index if not exists salon_services_salon_id_idx on public.salon_services (salon_id);
create index if not exists leads_salon_id_idx on public.leads (salon_id);
create index if not exists conversations_salon_id_idx on public.conversations (salon_id);
create index if not exists conversations_lead_id_idx on public.conversations (lead_id);
create index if not exists follow_ups_salon_id_idx on public.follow_ups (salon_id);
create index if not exists follow_ups_lead_id_idx on public.follow_ups (lead_id);

-- WhatsApp integration (see supabase/migrations/0001_whatsapp_fields.sql for
-- the guarded version of the leads unique index, which checks existing data
-- on a project that already has rows before enforcing uniqueness).
create unique index if not exists salons_whatsapp_phone_number_id_key
  on public.salons (whatsapp_phone_number_id)
  where whatsapp_phone_number_id is not null;

create unique index if not exists conversations_external_message_id_key
  on public.conversations (external_message_id)
  where external_message_id is not null;

create unique index if not exists leads_salon_phone_key
  on public.leads (salon_id, customer_phone)
  where customer_phone is not null and customer_phone <> '';

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever someone signs up
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Every table is scoped to salons owned by the logged-in user
-- (owner_id = auth.uid(), or salon_id -> salons.owner_id = auth.uid()).
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.salons enable row level security;
alter table public.salon_services enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.follow_ups enable row level security;

-- profiles: a user can only see/update their own profile row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- salons: owner-only access
drop policy if exists "salons_select_own" on public.salons;
create policy "salons_select_own" on public.salons
  for select using (owner_id = auth.uid());

drop policy if exists "salons_insert_own" on public.salons;
create policy "salons_insert_own" on public.salons
  for insert with check (owner_id = auth.uid());

drop policy if exists "salons_update_own" on public.salons;
create policy "salons_update_own" on public.salons
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "salons_delete_own" on public.salons;
create policy "salons_delete_own" on public.salons
  for delete using (owner_id = auth.uid());

-- salon_services / leads / conversations / follow_ups: access only through
-- a salon the current user owns.
do $$
declare
  t text;
begin
  foreach t in array array['salon_services', 'leads', 'conversations', 'follow_ups']
  loop
    execute format('drop policy if exists "%1$s_select_own_salon" on public.%1$s', t);
    execute format(
      'create policy "%1$s_select_own_salon" on public.%1$s for select
         using (exists (select 1 from public.salons s where s.id = %1$s.salon_id and s.owner_id = auth.uid()))',
      t
    );

    execute format('drop policy if exists "%1$s_insert_own_salon" on public.%1$s', t);
    execute format(
      'create policy "%1$s_insert_own_salon" on public.%1$s for insert
         with check (exists (select 1 from public.salons s where s.id = %1$s.salon_id and s.owner_id = auth.uid()))',
      t
    );

    execute format('drop policy if exists "%1$s_update_own_salon" on public.%1$s', t);
    execute format(
      'create policy "%1$s_update_own_salon" on public.%1$s for update
         using (exists (select 1 from public.salons s where s.id = %1$s.salon_id and s.owner_id = auth.uid()))
         with check (exists (select 1 from public.salons s where s.id = %1$s.salon_id and s.owner_id = auth.uid()))',
      t
    );

    execute format('drop policy if exists "%1$s_delete_own_salon" on public.%1$s', t);
    execute format(
      'create policy "%1$s_delete_own_salon" on public.%1$s for delete
         using (exists (select 1 from public.salons s where s.id = %1$s.salon_id and s.owner_id = auth.uid()))',
      t
    );
  end loop;
end $$;
