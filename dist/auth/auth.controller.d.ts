import { AuthService } from './auth.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from 'src/users/domain/user';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    login(loginDto: AuthEmailLoginDto): Promise<LoginResponseType>;
    register(createUserDto: AuthRegisterLoginDto): Promise<void>;
    confirmEmail(confirmEmailDto: AuthConfirmEmailDto): Promise<void>;
    forgotPassword(forgotPasswordDto: AuthForgotPasswordDto): Promise<void>;
    resetPassword(resetPasswordDto: AuthResetPasswordDto): Promise<void>;
    me(request: any): Promise<NullableType<User>>;
    refresh(request: any): Promise<Omit<LoginResponseType, 'user'>>;
    logout(request: any): Promise<void>;
    update(request: any, userDto: AuthUpdateDto): Promise<NullableType<User>>;
    delete(request: any): Promise<void>;
}
