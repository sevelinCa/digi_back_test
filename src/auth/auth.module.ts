import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { SessionModule } from 'src/session/session.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserRepository } from 'src/users/infrastructure/persistence/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SmsModule } from 'src/sms/sms.module';
import { CustomerSubscriptionService } from 'src/digifranchise-subscription/customer-subscription.service';
import { DigifranchiseSubscriptionModule } from 'src/digifranchise-subscription/digifranchise-subscription.module';
import { CustomerSubscription } from 'src/digifranchise-subscription/entities/customer-subscription.entity';
import { Digifranchise } from 'src/digifranchise/entities/digifranchise.entity';

@Module({
  imports: [
    UsersModule,
    SessionModule,
    PassportModule,
    MailModule,
    SmsModule,
    DigifranchiseSubscriptionModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserEntity, CustomerSubscription, Digifranchise])
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    JwtStrategy, 
    JwtRefreshStrategy, 
    AnonymousStrategy,
    CustomerSubscriptionService
  ],
  exports: [AuthService],
})
export class AuthModule {}
