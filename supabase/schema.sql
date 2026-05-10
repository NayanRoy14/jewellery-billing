-- Jewellery Billing MVP — Supabase Schema
-- Run this in the Supabase SQL Editor

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.shops (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null default 'My Jewellery Shop',
  address     text not null default '',
  phone       text not null default '',
  gstin       text not null default '',
  logo_url    text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.gold_rates (
  id             uuid primary key default uuid_generate_v4(),
  shop_id        uuid references public.shops(id) on delete cascade,
  karat          smallint not null check (karat in (22, 24)),
  rate           numeric(10, 2) not null,
  effective_date date not null default current_date,
  created_at     timestamptz not null default now()
);

create table if not exists public.invoices (
  id                    uuid primary key default uuid_generate_v4(),
  local_id              text unique not null,
  invoice_number        text not null,

  -- Buyer (customer)
  buyer_name            text not null default '',
  buyer_phone           text not null default '',
  buyer_address         text not null default '',
  buyer_pan             text not null default '',

  -- Seller (supplier / party selling)
  seller_name           text not null default '',
  seller_phone          text not null default '',
  seller_address        text not null default '',
  seller_pan            text not null default '',

  -- Items (multi-item stored as JSON array)
  items                 jsonb not null default '[]',

  -- Shared rate and GST
  gold_rate             numeric(10, 2) not null,
  gst_percent           numeric(5, 2) not null default 3.00,

  -- Computed totals
  subtotal              numeric(12, 2) not null,
  discount              numeric(12, 2) not null default 0,
  after_discount        numeric(12, 2) not null default 0,
  gst_amount            numeric(12, 2) not null,
  total                 numeric(12, 2) not null,
  round_off             numeric(10, 4) not null default 0,
  grand_total           numeric(12, 2) not null,

  -- Shop snapshot
  shop_name             text not null default '',
  shop_address          text not null default '',
  shop_phone            text not null default '',
  shop_gstin            text not null default '',

  created_at            timestamptz not null default now(),
  synced_at             timestamptz
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────
create index if not exists invoices_buyer_name_idx  on public.invoices (buyer_name);
create index if not exists invoices_created_at_idx  on public.invoices (created_at desc);
create index if not exists invoices_local_id_idx    on public.invoices (local_id);

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- MVP: open policies. Tighten once auth is wired up.

alter table public.shops      enable row level security;
alter table public.gold_rates enable row level security;
alter table public.invoices   enable row level security;

drop policy if exists "Allow all for MVP" on public.shops;
drop policy if exists "Allow all for MVP" on public.gold_rates;
drop policy if exists "Allow all for MVP" on public.invoices;

create policy "Allow all for MVP" on public.shops
  for all using (true) with check (true);

create policy "Allow all for MVP" on public.gold_rates
  for all using (true) with check (true);

create policy "Allow all for MVP" on public.invoices
  for all using (true) with check (true);

-- ─── updated_at trigger ───────────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_shops_updated_at on public.shops;
create trigger set_shops_updated_at
  before update on public.shops
  for each row execute procedure public.handle_updated_at();
