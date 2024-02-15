import { AuthService } from '../auth/auth.service';
import { AuthAppleService } from './auth-apple.service';
import { AuthAppleLoginDto } from './dto/auth-apple-login.dto';
import { LoginResponseType } from '../auth/types/login-response.type';
export declare class AuthAppleController {
    private readonly authService;
    private readonly authAppleService;
    constructor(authService: AuthService, authAppleService: AuthAppleService);
    login(loginDto: AuthAppleLoginDto): Promise<LoginResponseType>;
}
