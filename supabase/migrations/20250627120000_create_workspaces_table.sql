-- Create the workspaces table
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  description text,
  owner_id uuid not null references auth.users(id),
  is_team boolean not null default false,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  deleted_at timestamp with time zone,
  constraint unique_owner_workspace_name unique (owner_id, name),
  constraint name_not_empty check (char_length(name) > 0)
);

-- Index for quick lookup by owner
create index workspaces_owner_id_idx on public.workspaces(owner_id);

-- Trigger function to auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language 'plpgsql';

-- Trigger to call the function before every update
create trigger update_workspace_updated_at
before update on public.workspaces
for each row
execute procedure update_updated_at_column(); 