import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ForgotPasswordDto, RefreshTokenDto, UpdatePasswordDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { User } from './user.decorator';
import { Provider } from '@supabase/supabase-js';
import { BadRequestException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body() authDto: AuthDto) {
        return this.authService.register(authDto);
    }

    @Post('login')
    async login(@Body() authDto: AuthDto) {
        return this.authService.login(authDto);
    }

    @Get('oauth/:provider')
    async oauth(@Param('provider') provider: Provider) {
        return this.authService.oauth(provider);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@User() user) {
        return this.authService.getProfile(user);
    }

    @UseGuards(AuthGuard)
    @Post('sync-profile')
    async syncProfile(@User() user) {
        return this.authService.syncProfile(user);
    }

    @Post('logout')
    async logout() {
        return this.authService.logout();
    }

    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        try {
            await this.authService.forgotPassword(dto.email);
            return { success: true };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }

    @Post('refresh-token')
    async refreshToken(@Body() dto: RefreshTokenDto) {
        return this.authService.refreshToken(dto.refresh_token);
    }

    @UseGuards(AuthGuard)
    @Post('update-password')
    async updatePassword(@Body() dto: UpdatePasswordDto, @User() user) {
        try {
            await this.authService.updatePassword(dto.newPassword);
            return { success: true };
        } catch (e) {
            throw new BadRequestException(e.message);
        }
    }
} 