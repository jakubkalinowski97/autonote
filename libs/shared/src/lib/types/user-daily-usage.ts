import { Database } from './supabase.generated';

export type UserDailyUsage = Database['public']['Tables']['user_daily_usage']['Row'];
export type UserDailyUsageInsert = Database['public']['Tables']['user_daily_usage']['Insert'];
export type UserDailyUsageUpdate = Database['public']['Tables']['user_daily_usage']['Update'];