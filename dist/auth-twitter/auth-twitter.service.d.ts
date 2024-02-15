import { ConfigService } from '@nestjs/config';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthTwitterLoginDto } from './dto/auth-twitter-login.dto';
import { AllConfigType } from 'src/config/config.type';
export declare class AuthTwitterService {
    private configService;
    constructor(configService: ConfigService<AllConfigType>);
    getProfileByToken(loginDto: AuthTwitterLoginDto): Promise<SocialInterface>;
}
