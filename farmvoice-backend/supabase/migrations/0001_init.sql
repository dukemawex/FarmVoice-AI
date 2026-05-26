create extension if not exists "pgcrypto";

create table if not exists farmer_profiles (
  id uuid primary key default gen_random_uuid(),
  phone text unique,
  whatsapp_id text unique,
  full_name text,
  language text default 'en' check (language in ('en','ha','yo','sw','fr')),
  country text,
  state_province text,
  primary_crops text[],
  farm_size_hectares float,
  channel text default 'web' check (channel in ('web','whatsapp','ussd')),
  created_at timestamptz default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references farmer_profiles(id),
  channel text check (channel in ('web','whatsapp','ussd')),
  session_id text,
  started_at timestamptz default now(),
  ended_at timestamptz,
  message_count integer default 0,
  primary_topic text,
  resolved boolean default false
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id),
  role text check (role in ('user','assistant','system')),
  content text,
  language text,
  audio_url text,
  intent text,
  entities jsonb,
  created_at timestamptz default now()
);

create table if not exists market_prices (
  id uuid primary key default gen_random_uuid(),
  crop text,
  market_name text,
  country text,
  state_province text,
  price_per_kg float,
  currency text,
  price_date date,
  source text,
  created_at timestamptz default now()
);

create table if not exists agro_advisories (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  crop text,
  country text,
  season text,
  advisory_type text check (advisory_type in ('pest','disease','weather','planting','harvest','market')),
  valid_from date,
  valid_until date,
  source text,
  created_at timestamptz default now()
);

create table if not exists loan_products (
  id uuid primary key default gen_random_uuid(),
  provider_name text,
  product_name text,
  country text,
  min_amount float,
  max_amount float,
  currency text,
  interest_rate float,
  tenure_months integer,
  eligibility_criteria text,
  application_url text,
  phone_number text,
  active boolean default true
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  farmer_id uuid references farmer_profiles(id),
  conversation_id uuid references conversations(id),
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table if not exists ussd_sessions (
  session_id text primary key,
  phone_number text,
  farmer_id uuid references farmer_profiles(id),
  conversation_id uuid references conversations(id),
  state text not null default 'root',
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz default now()
);
