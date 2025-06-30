CREATE TABLE public.user_monthly_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  year_month date NOT NULL, -- e.g., '2024-07-01'
  transformations_count integer DEFAULT 0,
  storage_used_bytes bigint DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, year_month)
); 