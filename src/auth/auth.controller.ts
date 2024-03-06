import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  Req,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { LoginResponseType } from './types/login-response.type';
import { NullableType } from '../utils/types/nullable.type';
import { User } from 'src/users/domain/user';
import { AuthPhoneRegisterDto } from './dto/auth-phone-register.dto';
import { AuthConfirmPhoneDto } from './dto/auth-confirm-phone.dto';
import { UserProfileDto } from 'src/user/dto/user.profile.dto';
import { AuthPhoneLoginDto } from './dto/auth-phone-login.dto';
import { GoogleCreateUserDto } from './dto/google-create-user.dto';
import { FaceBookCreateUserDto } from './dto/facebook-create-user.dto';
import { PhoneForgotPasswordDto } from './dto/auth-phone-forgot-password.dto';
import { PhoneRestPasswordDto } from './dto/auth-phone-reset-password.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly service: AuthService) { }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
  ) {
    const data = await this.service.validateLogin(loginDto);
    return {
      user: {
        ...data.user,
        token: data.token,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires
      }


    }
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Post('digifranchise-super-admin/google')
  @HttpCode(HttpStatus.OK)
  public async googleAuthentication(
    @Req() req,
    @Body() authDto: GoogleCreateUserDto,
  ) {
    const data = await this.service.googleAuth(authDto);
    return {
      user: {
        ...data.user,
        token: data.token,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires
      }
    }
  }


  @SerializeOptions({
    groups: ['me'],
  })
  @Post('phone/login')
  @HttpCode(HttpStatus.OK)
  public async phoneLogin(
    @Body() phoneLoginDto: AuthPhoneLoginDto,
  ) {
    const data = await this.service.phoneLogin(phoneLoginDto);
    return {
      user: {
        ...data.user,
        token: data.token,
        refreshToken: data.refreshToken,
        tokenExpires: data.tokenExpires
      }
    }
  }


  @Post('email/digifranchise-super-admin/register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    await this.service.register(createUserDto);
    
    return {
      message: "SignUp is successfull, check your email to verify!!"
    }
  }

  @Post('phone/digifranchise-super-admin/register')
  @HttpCode(HttpStatus.OK)
  async phoneRegister(@Body() phoneRegisterDto: AuthPhoneRegisterDto): Promise<void> {
    return this.service.phoneRegister(phoneRegisterDto);
  }

  @Post('phone/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmOtp(@Body() phoneRegisterDto: AuthConfirmPhoneDto): Promise<void> {
    return this.service.verifyUserWithPhone(phoneRegisterDto);
  }

  @Post('phone/forgot-password')
  @HttpCode(HttpStatus.OK)
  async phoneForgotPassword(@Body() phoneForgotPasswordDto: PhoneForgotPasswordDto) {
    return this.service.forgotPasswordWithPhone(phoneForgotPasswordDto.phoneNumber)
  }

  @Post('phone/reset-password')
  @HttpCode(HttpStatus.OK)
  async phoneResetPassword(@Body() dto: PhoneRestPasswordDto) {
    return this.service.resetPasswordWithPhone(dto.otp, dto.phoneNumber, dto.newPassword)
  }


  @Post('email/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmEmail(
    @Body() confirmPhoneDto: AuthConfirmEmailDto,
  ): Promise<void> {
    return this.service.confirmEmail(confirmPhoneDto.hash);
  }

  @Post('forgot/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    return this.service.resetPassword(
      resetPasswordDto.hash,
      resetPasswordDto.password,
    );
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public me(@Request() request): Promise<NullableType<User>> {
    return this.service.me(request.user);
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public refresh(@Request() request): Promise<Omit<LoginResponseType, 'user'>> {
    return this.service.refreshToken({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(@Request() request): Promise<void> {
    await this.service.logout({
      sessionId: request.user.sessionId,
    });
  }

  @ApiBearerAuth()
  @SerializeOptions({
    groups: ['me'],
  })
  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async update(
    @Request() request,
    @Body() updateUserProfileDto: UserProfileDto,
  ) {
    await this.service.update(request.user, updateUserProfileDto);
    
    return {
      message: "Update is successfull"
    }
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Request() request): Promise<void> {
    return this.service.softDelete(request.user);
  }
}
