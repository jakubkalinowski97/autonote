import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthDto } from './auth.dto';
import { Provider, Session } from '@supabase/supabase-js';
import { User, UserInsert } from '@auto-note-workspace/shared';

@Injectable()
export class AuthService {
    constructor(private readonly supabaseService: SupabaseService) { }

    getSupabase() {
        return this.supabaseService.getClient();
    }

    async register(authDto: AuthDto) {
        const result = await this.getSupabase().auth.signUp({
            email: authDto.email,
            password: authDto.password,
            options: {
                data: { name: authDto.name },
            },
        });
        if (result.error) {
            throw new BadRequestException(result.error.message);
        }
        // Initial insert into public.users is now handled by a DB trigger on auth.users
        return result;
    }

    async login(authDto: AuthDto) {
        const result = await this.getSupabase().auth.signInWithPassword({
            email: authDto.email,
            password: authDto.password,
        });
        if (result.error) {
            throw new UnauthorizedException(result.error.message);
        }
        return result;
    }

    async oauth(provider: Provider) {
        const result = await this.getSupabase().auth.signInWithOAuth({
            provider: provider as Provider,
        });
        if (result.error) {
            throw new BadRequestException(result.error.message);
        }
        // OAuth flow: user is redirected, so upsert will be handled after callback with user info
        return result;
    }

    async getProfile(user: User): Promise<any> {
        // Fetch the user row (with role) from public.users, and join the workspace name
        const { data: userRow, error } = await this.supabaseService.getClient()
            .from('users')
            .select(`
                *,
                last_selected_workspace:workspaces!users_last_selected_workspace_id_fkey (
                    name
                )
            `)
            .eq('id', user.id)
            .single();

        if (error || !userRow) {
            throw new Error('User not found in public.users');
        }
        return userRow;
    }

    async logout(): Promise<void> {
        const result = await this.getSupabase().auth.signOut();
        if (result.error) {
            throw new BadRequestException(result.error.message);
        }
    }

    async upsertUserRecord(user: UserInsert & { id: string; email: string; name?: string; user_metadata?: any }): Promise<void> {
        const { id, email, name, user_metadata } = user;
        const { error } = await this.supabaseService.getClient()
            .from('users')
            .upsert([
                {
                    id,
                    email,
                    name: name ?? user_metadata?.name ?? null,
                    profile: user_metadata ?? null,
                    updated_at: new Date().toISOString(),
                } as UserInsert,
            ], { onConflict: 'id' });
        if (error) {
            throw new Error('Failed to upsert user record: ' + error.message);
        }
    }

    async forgotPassword(email: string): Promise<void> {
        const { error } = await this.getSupabase().auth.resetPasswordForEmail(email);
        if (error) {
            throw new Error('Failed to request password reset: ' + error.message);
        }
    }

    async updatePassword(newPassword: string): Promise<void> {
        const { error } = await this.getSupabase().auth.updateUser({
            password: newPassword,
        });
        if (error) {
            throw new Error('Failed to update password: ' + error.message);
        }
    }

    async refreshToken(refresh_token: string): Promise<Session> {
        const result = await this.getSupabase().auth.refreshSession({ refresh_token });
        if (result.error) {
            throw new BadRequestException(result.error.message);
        }
        return result.data.session;
    }
} 