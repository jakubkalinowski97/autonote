import { Database } from './supabase.generated';

export type UserMonthlyUsage = Database['public']['Tables']['user_monthly_usage']['Row'];
export type UserMonthlyUsageInsert = Database['public']['Tables']['user_monthly_usage']['Insert'];
export type UserMonthlyUsageUpdate = Database['public']['Tables']['user_monthly_usage']['Update'];