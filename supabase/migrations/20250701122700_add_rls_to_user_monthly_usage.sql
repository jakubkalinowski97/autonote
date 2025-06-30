ALTER TABLE public.user_monthly_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User can access own monthly usage"
  ON public.user_monthly_usage
  FOR ALL
  USING (user_id = auth.uid()); 