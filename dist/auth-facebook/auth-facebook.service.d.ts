import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthFacebookLoginDto } from './dto/auth-facebook-login.dto';
import { AllConfigType } from 'src/config/config.type';
export declare class AuthFacebookService {
    private configService;
    constructor(configService: ConfigService<AllConfigType>);
    getProfileByToken(loginDto: AuthFacebookLoginDto): Promise<SocialInterface>;
}
