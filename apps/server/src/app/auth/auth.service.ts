import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthDto } from './auth.dto';
import { Provider } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
    constructor(private readonly supabaseService: SupabaseService) {}

    getSupabase() {
        return this.supabaseService.getClient();
    }

    async register(authDto: AuthDto) {
        const result = await this.getSupabase().auth.signUp({
            email: authDto.email,
            password: authDto.password,
        });
        if (result.error) {
            throw new BadRequestException(result.error.message);
        }
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

    async getProfile(user: any) {
        // Fetch the user row (with role) from public.users
        const { data: userRow, error } = await this.supabaseService.getClient()
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error || !userRow) {
            throw new Error('User not found in public.users');
        }

        return userRow;
    }

    async syncProfile(user: any) {
        await this.upsertUserRecord({
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata,
        });
        return { success: true };
    }

    async logout() {
        const result = await this.getSupabase().auth.signOut();
        if (result.error) {
            throw new BadRequestException(result.error.message);
        }
        return result;
    }

    async upsertUserRecord(user: { id: string; email: string; user_metadata?: any }) {
        const { id, email, user_metadata } = user;
        const { data, error } = await this.supabaseService.getClient()
            .from('users')
            .upsert([
                {
                    id,
                    email,
                    profile: user_metadata ?? null,
                    updated_at: new Date().toISOString(),
                },
            ], { onConflict: 'id' });
        if (error) {
            throw new Error('Failed to upsert user record: ' + error.message);
        }
    }

    async forgotPassword(email: string) {
        const { error } = await this.getSupabase().auth.resetPasswordForEmail(email);
        if (error) {
            throw new Error('Failed to request password reset: ' + error.message);
        }
    }

    async updatePassword(newPassword: string) {
        const { error } = await this.getSupabase().auth.updateUser({
            password: newPassword,
        });
        if (error) {
            throw new Error('Failed to update password: ' + error.message);
        }
    }
} 