import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsageService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async checkCreateNoteLimit(userId: string): Promise<void> {
    // TODO: Check daily/monthly limits against user plan
    // For now, allow all operations
    return;
  }

  async checkQueryLimit(userId: string): Promise<void> {
    // TODO: Check daily/monthly query limits against user plan
    // For now, allow all operations
    return;
  }

  async incrementNoteCreation(userId: string): Promise<void> {
    // TODO: Update user_daily_usage and user_monthly_usage tables
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await this.supabaseService.getClient()
      .rpc('increment_usage', {
        user_id: userId,
        usage_date: today,
        increment_notes: 1
      });
    
    if (error) console.error('Failed to track note creation:', error);
  }

  async incrementQuery(userId: string): Promise<void> {
    // TODO: Update user_daily_usage and user_monthly_usage tables
    const today = new Date().toISOString().split('T')[0];
    
    const { error } = await this.supabaseService.getClient()
      .rpc('increment_usage', {
        user_id: userId,
        usage_date: today,
        increment_queries: 1
      });
    
    if (error) console.error('Failed to track query usage:', error);
  }
} 