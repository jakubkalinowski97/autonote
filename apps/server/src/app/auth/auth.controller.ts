import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { User } from './user.decorator';
import { Provider } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() authDto: AuthDto) {
        return this.authService.getSupabase().auth.signUp({
            email: authDto.email,
            password: authDto.password,
        });
    }

    @Post('login')
    async login(@Body() authDto: AuthDto) {
        return this.authService.getSupabase().auth.signInWithPassword({
            email: authDto.email,
            password: authDto.password,
        });
    }

    @Get('oauth/:provider')
    async oauth(@Param('provider') provider: Provider) {
        return this.authService.getSupabase().auth.signInWithOAuth({
            provider: provider as Provider,
        });
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@User() user) {
        return user;
    }
} 