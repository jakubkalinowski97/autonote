import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Workspace, WorkspaceInsert, WorkspaceUpdate } from '@auto-note-workspace/shared';

@Injectable()
export class WorkspaceService {
  private readonly table = 'workspaces';

  constructor(private readonly supabaseService: SupabaseService) {}

    async create(data: WorkspaceInsert): Promise<Workspace> {
    const { data: result, error } = await this.supabaseService.getClient()
      .from(this.table)
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result as Workspace;
  }

  async findAll(userId: string): Promise<Workspace[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from(this.table)
      .select('*')
      .eq('owner_id', userId);
    if (error) throw error;
    return data as Workspace[];
  }

  async findOne(id: string): Promise<Workspace> {
    const { data, error } = await this.supabaseService.getClient()
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Workspace;
  }

  async update(id: string, data: WorkspaceUpdate): Promise<Workspace> {
    const { data: result, error } = await this.supabaseService.getClient()
      .from(this.table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result as Workspace;
  }

  async remove(id: string): Promise<Workspace> {
    const { data, error } = await this.supabaseService.getClient()
      .from(this.table)
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Workspace;
  }
} 