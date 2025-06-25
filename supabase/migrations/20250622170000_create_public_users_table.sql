-- Migration: Create public.users table for app-specific user metadata

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'free',
  stripe_customer_id text,
  profile jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row-Level Security
alter table public.users enable row level security;

-- Policy: Users can only see/update their own row
create policy "Users can manage their own row"
  on public.users
  for all
  using (auth.uid() = id); 