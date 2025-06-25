import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly supabaseService: SupabaseService,
        private readonly authService: AuthService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const { data, error } = await this.supabaseService.getClient().auth.getUser(token);

            if (error || !data.user) {
                throw new UnauthorizedException();
            }

            // Upsert user in public.users if missing
            await this.authService.upsertUserRecord({
                id: data.user.id,
                email: data.user.email,
                user_metadata: data.user.user_metadata,
            });
            
            // Fetch role from public.users
            const { data: userRow, error: userError } = await this.supabaseService.getClient()
                .from('users')
                .select('role')
                .eq('id', data.user.id)
                .single();
            if (userError || !userRow) {
                throw new UnauthorizedException('User not found in DB after upsert');
            }
            request['user'] = { ...data.user, role: userRow.role };
        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
} 