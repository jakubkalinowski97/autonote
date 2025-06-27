-- Add last_selected_workspace_id to users table for tracking user's last selected workspace
ALTER TABLE public.users
ADD COLUMN last_selected_workspace_id uuid REFERENCES public.workspaces(id) ON DELETE SET NULL;

-- Add an index for efficient lookup
CREATE INDEX users_last_selected_workspace_id_idx ON public.users(last_selected_workspace_id);

-- Add a comment for documentation
COMMENT ON COLUMN public.users.last_selected_workspace_id IS 'Tracks the last workspace selected by the user (nullable, FK to workspaces)'; 