import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { AuthProvidersEnum } from './auth-providers.enum';
import { SocialInterface } from '../social/interfaces/social.interface';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { MailService } from 'src/mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import { LoginResponseType } from './types/login-response.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { User } from 'src/users/domain/user';
import { Session } from 'src/session/domain/session';
import { UsersService } from 'src/users/users.service';
import { SessionService } from 'src/session/session.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { AuthPhoneRegisterDto } from './dto/auth-phone-register.dto';
import { SmsService } from 'src/sms/sms.service';
import { AuthConfirmPhoneDto } from './dto/auth-confirm-phone.dto';
import { GoogleCreateUserDto } from './dto/google-create-user.dto';
import { UserProfileDto } from 'src/user/dto/user.profile.dto';
import { AuthPhoneLoginDto } from './dto/auth-phone-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
    private smsService: SmsService,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<User>
  ) { }

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!user.password) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async googleAuth(googleUser: GoogleCreateUserDto): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email: googleUser.email as string },
    });

    if (user) {
      const session = await this.sessionService.create({
        user,
      });

      const { token, refreshToken, tokenExpires } = await this.getTokensData({
        id: user.id,
        role: user.role,
        sessionId: session.id,
      });

      return {
        refreshToken,
        token,
        tokenExpires,
        user,
      };
    } else {

      const newUser = await this.usersRepository.save(
        this.usersRepository.create({
          ...googleUser,
          role: {
            id: RoleEnum.digifranchise_super_admin
          },
          status: {
            id: StatusEnum.active
          },
          image: googleUser.profilePic,
        }),
      );

      const user = await this.usersRepository.findOne({
        where: { email: newUser.email as string },
      });

      if (user) {
        const session = await this.sessionService.create({
          user,
        });
        const { token, refreshToken, tokenExpires } = await this.getTokensData({
          id: user.id,
          role: newUser.role,
          sessionId: session.id,
        });

        return {
          refreshToken,
          token,
          tokenExpires,
          newUser,
        }
      }
    }
  }

  // async validateSocialLogin(
  //   authProvider: string,
  //   socialData: SocialInterface,
  // ): Promise<LoginResponseType> {
  //   let user: NullableType<User> = null;
  //   const socialEmail = socialData.email?.toLowerCase();
  //   let userByEmail: NullableType<User> = null;

  //   if (socialEmail) {
  //     userByEmail = await this.usersService.findOne({
  //       email: socialEmail,
  //     });
  //   }

  //   if (socialData.id) {
  //     user = await this.usersService.findOne({
  //       socialId: socialData.id,
  //       provider: authProvider,
  //     });
  //   }

  //   if (user) {
  //     if (socialEmail && !userByEmail) {
  //       user.email = socialEmail;
  //     }
  //     await this.usersService.update(user.id, user);
  //   } else if (userByEmail) {
  //     user = userByEmail;
  //   } else {
  //     const role = {
  //       id: RoleEnum.digifranchise_super_admin,
  //     };
  //     const status = {
  //       id: StatusEnum.active,
  //     };

  //     user = await this.usersService.create({
  //       email: socialEmail ?? null,
  //       firstName: socialData.firstName ?? null,
  //       lastName: socialData.lastName ?? null,
  //       socialId: socialData.id,
  //       provider: authProvider,
  //       role,
  //       status,
  //     });

  //     user = await this.usersService.findOne({
  //       id: user?.id,
  //     });
  //   }

  //   if (!user) {
  //     throw new HttpException(
  //       {
  //         status: HttpStatus.UNPROCESSABLE_ENTITY,
  //         errors: {
  //           user: 'userNotFound',
  //         },
  //       },
  //       HttpStatus.UNPROCESSABLE_ENTITY,
  //     );
  //   }

  //   const session = await this.sessionService.create({
  //     user,
  //   });

  //   const {
  //     token: jwtToken,
  //     refreshToken,
  //     tokenExpires,
  //   } = await this.getTokensData({
  //     id: user.id,
  //     role: user.role,
  //     sessionId: session.id,
  //   });

  //   return {
  //     refreshToken,
  //     token: jwtToken,
  //     tokenExpires,
  //     user,
  //   };
  // }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      phoneNumber: null,
      role: {
        id: RoleEnum.digifranchise_super_admin,
      },
      status: {
        id: StatusEnum.inactive,
      },
      image: null,
      idImage: null,
      gender: null,
      race: null,
      homeAddress: null,
      educationLevel: null,
      currentActivity: null,
      fieldOfStudy: null,
      qualifications: null,
      professionalBody: null,
      isProfileComplete: false
    });

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );

    await this.mailService.userSignUp({
      to: dto.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `invalidHash`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.usersService.findOne({
      id: userId,
    });


    if (!user || user?.status?.id !== StatusEnum.inactive) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedStatus = {
      id: StatusEnum.active,
    };

    Object.assign(user, { status: updatedStatus.id })
    await this.usersRepository.save(user)
  }

  async phoneRegister(dto: AuthPhoneRegisterDto) {
    const user = await this.usersService.create({
      ...dto,
      provider: AuthProvidersEnum.phone,
      email: null,
      phoneNumber: dto.phoneNumber,
      role: {
        id: RoleEnum.digifranchise_super_admin,
      },
      status: {
        id: StatusEnum.inactive,
      },
      image: null,
      idImage: null,
      gender: null,
      race: null,
      homeAddress: null,
      educationLevel: null,
      currentActivity: null,
      fieldOfStudy: null,
      qualifications: null,
      professionalBody: null,
      isProfileComplete: false
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: {
            phoneNumber: 'failedToCreatUser',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.smsService.sendOTP(dto.phoneNumber)
  }

  async phoneLogin(dto: AuthPhoneLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({
      phoneNumber: dto.phoneNumber,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.provider !== AuthProvidersEnum.phone) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (!user.password) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password)

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionService.create({
      user,
    });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async verifyUserWithPhone(dto: AuthConfirmPhoneDto) {
    const phoneIsVerified = await this.smsService.verifyOTP(dto.phoneNumber, dto.otp)

    if (phoneIsVerified) {
      const user = await this.usersService.findOne({ phoneNumber: dto.phoneNumber })
      if (!user || user?.status?.id !== StatusEnum.inactive) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `notFound`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedStatus = {
        id: StatusEnum.active,
      };
      Object.assign(user, { status: updatedStatus.id })
      await this.usersRepository.save(user)
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOne({
      email,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.forgotExpires', {
          infer: true,
        }),
      },
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
      },
    });
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.forgotSecret', {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `invalidHash`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = await this.usersService.findOne({
      id: userId,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // user.password = password;

    Object.assign(user, { password: hashedPassword })

    await this.usersRepository.save(user)
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.usersService.findOne({
      id: userJwtPayload.id,
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserProfileDto: UserProfileDto,
  ): Promise<void> {
    // if (userDto.password) {

    //   if (!userDto.oldPassword) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.UNPROCESSABLE_ENTITY,
    //         errors: {
    //           oldPassword: 'missingOldPassword',
    //         },
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   }

    //   const currentUser = await this.usersService.findOne({
    //     id: userJwtPayload.id,
    //   });

    //   if (!currentUser) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.UNPROCESSABLE_ENTITY,
    //         errors: {
    //           user: 'userNotFound',
    //         },
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   }

    //   if (!currentUser.password) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.UNPROCESSABLE_ENTITY,
    //         errors: {
    //           oldPassword: 'incorrectOldPassword',
    //         },
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   }

    //   const isValidOldPassword = await bcrypt.compare(
    //     userDto.oldPassword,
    //     currentUser.password,
    //   );

    //   if (!isValidOldPassword) {
    //     throw new HttpException(
    //       {
    //         status: HttpStatus.UNPROCESSABLE_ENTITY,
    //         errors: {
    //           oldPassword: 'incorrectOldPassword',
    //         },
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   } else {
    //     await this.sessionService.softDelete({
    //       user: {
    //         id: currentUser.id,
    //       },
    //       excludeId: userJwtPayload.sessionId,
    //     });
    //   }
    // }

    // await this.usersService.update(userJwtPayload.id, userDto);

    // return this.usersService.findOne({
    //   id: userJwtPayload.id,
    // });

    const user = await this.usersService.findOne({
      id: userJwtPayload.id,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (updateUserProfileDto.email) {
      const userObject = await this.usersService.findOne({
        email: updateUserProfileDto.email,
      });

      if (userObject && userObject.id !== userJwtPayload.id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'emailAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (updateUserProfileDto.mobileNumber) {
      const userObject = await this.usersService.findOne({
        phoneNumber: updateUserProfileDto.mobileNumber,
      });

      if (userObject && userObject.id !== userJwtPayload.id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'phoneNumberAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }


    Object.assign(user, {
      image: updateUserProfileDto?.image,
      email: updateUserProfileDto?.email,
      firstName: updateUserProfileDto?.firstName,
      lastName: updateUserProfileDto?.lastName,
      idImage: updateUserProfileDto?.idImage,
      gender: updateUserProfileDto?.gender,
      race: updateUserProfileDto?.race,
      homeAddress: updateUserProfileDto?.homeAddress,
      phoneNumber: updateUserProfileDto?.mobileNumber,
      educationLevel: updateUserProfileDto?.educationLevel,
      currentActivity: updateUserProfileDto?.currentActivity,
      fieldOfStudy: updateUserProfileDto?.fieldOfStudy,
      qualifications: updateUserProfileDto?.qualifications,
      professionalBody: updateUserProfileDto?.professionalBody,
    })

    await this.usersRepository.save(user)
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'>> {
    const session = await this.sessionService.findOne({
      id: data.sessionId,
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
    });

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.softDelete(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
