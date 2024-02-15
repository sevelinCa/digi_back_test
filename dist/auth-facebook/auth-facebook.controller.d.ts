import { AuthService } from '../auth/auth.service';
import { AuthFacebookService } from './auth-facebook.service';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { LoginResponseType } from '../auth/types/login-response.type';
export declare class AuthFacebookController {
    private readonly authService;
    private readonly authFacebookService;
    constructor(authService: AuthService, authFacebookService: AuthFacebookService);
    login(loginDto: AuthFacebookLoginDto): Promise<LoginResponseType>;
}
