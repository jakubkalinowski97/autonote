-- Enable Row Level Security on workspaces table
alter table public.workspaces enable row level security;

-- Allow only the owner to access their workspaces
create policy "Allow workspace owner full access"
on public.workspaces
for all
using (auth.uid() = owner_id); 