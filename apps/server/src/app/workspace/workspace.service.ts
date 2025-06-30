import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Workspace, WorkspaceInsert, WorkspaceUpdate } from '@auto-note-workspace/shared';

@Injectable()
export class WorkspaceService {
  private readonly workspaceTable = 'workspaces';
  private readonly userTable = 'users';

  constructor(private readonly supabaseService: SupabaseService) {}

    async create(data: WorkspaceInsert): Promise<Workspace> {
    const { data: result, error } = await this.supabaseService.getClient()
      .from(this.workspaceTable)
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return result as Workspace;
  }

  async findAll(userId: string): Promise<Workspace[]> {
    const { data, error } = await this.supabaseService.getClient()
      .from(this.workspaceTable)
      .select('*')
      .eq('owner_id', userId);
    if (error) throw error;
    return data as Workspace[];
  }

  async findOne(id: string): Promise<Workspace> {
    const { data, error } = await this.supabaseService.getClient()
      .from(this.workspaceTable)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Workspace;
  }

  async update(id: string, data: WorkspaceUpdate): Promise<Workspace> {
    const { data: result, error } = await this.supabaseService.getClient()
      .from(this.workspaceTable)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result as Workspace;
  }

  async remove(id: string, userId: string): Promise<Workspace> {
    // Fetch the user to check last_selected_workspace_id
    const { data: user, error: userError } = await this.supabaseService.getClient()
      .from(this.userTable)
      .select('last_selected_workspace_id')
      .eq('id', userId)
      .single();
    if (userError) throw userError;
    if (user?.last_selected_workspace_id === id) {
      throw new Error('Cannot remove the currently selected workspace. Please select a different workspace first.');
    }
    // Proceed with removal
    const { data, error } = await this.supabaseService.getClient()
      .from(this.workspaceTable)
      .delete()
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Workspace;
  }

  async activate(id: string, userId: string): Promise<Workspace> {
    const { data, error } = await this.supabaseService.getClient()
      .from(this.userTable)
      .update({ last_selected_workspace_id: id })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data as Workspace;
  }
} 