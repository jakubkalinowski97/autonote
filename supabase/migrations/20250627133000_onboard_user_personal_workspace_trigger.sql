-- Function to create a 'Personal' workspace and set last_selected_workspace_id for new users
CREATE OR REPLACE FUNCTION create_personal_workspace_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create the Personal workspace
  INSERT INTO public.workspaces (name, owner_id)
  VALUES ('Personal', NEW.id);

  -- Set last_selected_workspace_id to the new workspace
  UPDATE public.users
  SET last_selected_workspace_id = (
    SELECT id FROM public.workspaces WHERE owner_id = NEW.id AND name = 'Personal' ORDER BY created_at ASC LIMIT 1
  )
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to run the function after a new user is inserted
CREATE TRIGGER trigger_create_personal_workspace
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION create_personal_workspace_for_new_user(); 