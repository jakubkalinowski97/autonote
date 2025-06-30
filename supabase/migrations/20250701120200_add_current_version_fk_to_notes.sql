ALTER TABLE public.notes
  ADD CONSTRAINT fk_current_version
  FOREIGN KEY (current_version_id) REFERENCES public.note_versions(id); 