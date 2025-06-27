export class AuthDto {
    email!: string;
    password!: string;
    name!: string;
}

export class ForgotPasswordDto {
    email!: string;
}

export class UpdatePasswordDto {
    newPassword!: string;
} 

export class RefreshTokenDto {
    refresh_token!: string;
}