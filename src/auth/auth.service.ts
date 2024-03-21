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
import { FaceBookCreateUserDto } from './dto/facebook-create-user.dto';
import { CustomerSubscriptionService } from 'src/digifranchise-subscription/customer-subscription.service';
import { CustomerSubscription } from 'src/digifranchise-subscription/entities/customer-subscription.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
    private smsService: SmsService,
    private customerSubscription: CustomerSubscriptionService,
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

  async customerEmailLogin(digifranchiseId: string, loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
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

    const getCustomerSubscriptions = await this.customerSubscription.getAllSubscriptions(user.id)

    getCustomerSubscriptions.map(async (subscription: CustomerSubscription) => {
      if (subscription.digifranchiseOwnerId.id === digifranchiseId) {
        return
      } else {
        await this.customerSubscription.createSubscription(user.id, digifranchiseId)
      }
    })

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
          provider: 'google',
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

  async googleAuthCustomer(digifranchiseId: string, googleUser: GoogleCreateUserDto): Promise<any> {
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
            id: RoleEnum.customer
          },
          status: {
            id: StatusEnum.active
          },
          image: googleUser.profilePic,
          provider: 'google',
        }),
      );

      const user = await this.usersRepository.findOne({
        where: { email: newUser.email as string },
      });

      if (user) {
        const session = await this.sessionService.create({
          user,
        });

        const getCustomerSubscriptions = await this.customerSubscription.getAllSubscriptions(user.id)

        getCustomerSubscriptions.map(async (subscription: CustomerSubscription) => {
          if (subscription.digifranchiseOwnerId.id === digifranchiseId) {
            return
          } else {
            await this.customerSubscription.createSubscription(user.id, digifranchiseId)
          }
        })
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
      southAfricanCitizen: null,
      documentId: null,
      countryOfOrigin: null,
      criminalRecord: null,
      policeClearenceCertificate: null,
      crimes: null,
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

  async customerRegister(digifranchiseId: string, dto: AuthRegisterLoginDto): Promise<void> {
    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      phoneNumber: null,
      role: {
        id: RoleEnum.customer,
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
      southAfricanCitizen: null,
      documentId: null,
      countryOfOrigin: null,
      criminalRecord: null,
      policeClearenceCertificate: null,
      crimes: null,
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

    await this.customerSubscription.createSubscription(user.id, digifranchiseId)

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
      southAfricanCitizen: null,
      documentId: null,
      countryOfOrigin: null,
      criminalRecord: null,
      policeClearenceCertificate: null,
      crimes: null,
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

    if (user) {
      try {
        await this.smsService.sendOTP(dto.phoneNumber)
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            errors: {
              phoneNumber: 'failed to send SMS',
              message: 'user has been created but unable to SMS at this time'
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

  }

  async phoneCustomerRegister(digifranchiseId: string, dto: AuthPhoneRegisterDto) {
    const user = await this.usersService.create({
      ...dto,
      provider: AuthProvidersEnum.phone,
      email: null,
      phoneNumber: dto.phoneNumber,
      role: {
        id: RoleEnum.customer,
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
      southAfricanCitizen: null,
      documentId: null,
      countryOfOrigin: null,
      criminalRecord: null,
      policeClearenceCertificate: null,
      crimes: null,
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

    if (user) {
      try {
        await this.smsService.sendOTP(dto.phoneNumber)
        await this.customerSubscription.createSubscription(user.id, digifranchiseId)
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            errors: {
              phoneNumber: 'failed to send SMS',
              message: 'user has been created but unable to SMS at this time'
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
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
            phone: 'notFound',
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

  async customerPhoneLogin(digifranchiseId: string, dto: AuthPhoneLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({
      phoneNumber: dto.phoneNumber,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            phone: 'notFound',
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

    const getCustomerSubscriptions = await this.customerSubscription.getAllSubscriptions(user.id)

    getCustomerSubscriptions.map(async (subscription: CustomerSubscription) => {
      if (subscription.digifranchiseOwnerId.id === digifranchiseId) {
        return
      } else {
        await this.customerSubscription.createSubscription(user.id, digifranchiseId)
      }
    })

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
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Wrong otp'
        },
        HttpStatus.BAD_REQUEST
      )
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

  async forgotPasswordWithPhone(phoneNumber: string): Promise<any> {
    const user = await this.usersService.findOne({
      phoneNumber,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'phoneNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.smsService.sendOTP(phoneNumber)

    return { message: 'otp sent to phone, check messages' }
  }

  async resetPasswordWithPhone(otp: string, phoneNumber: string, newPassword: string): Promise<any> {
    const phoneIsVerified = await this.smsService.verifyOTP(phoneNumber, otp)

    if (!phoneIsVerified) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `otpExpired`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (phoneIsVerified) {
      const user = await this.usersService.findOne({ phoneNumber })
      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `notFound`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      Object.assign(user, { password: hashedPassword })
      await this.usersRepository.save(user)

      return { status: HttpStatus.OK, message: "password successfully reset" }
    }
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

    if (updateUserProfileDto.phoneNumber) {
      const userObject = await this.usersService.findOne({
        phoneNumber: updateUserProfileDto.phoneNumber,
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
      phoneNumber: updateUserProfileDto?.phoneNumber,
      educationLevel: updateUserProfileDto?.educationLevel,
      currentActivity: updateUserProfileDto?.currentActivity,
      fieldOfStudy: updateUserProfileDto?.fieldOfStudy,
      qualifications: updateUserProfileDto?.qualifications,
      professionalBody: updateUserProfileDto?.professionalBody,
      southAfricanCitizen: updateUserProfileDto?.southAfricanCitizen,
      documentId: updateUserProfileDto?.documentId,
      countryOfOrigin: updateUserProfileDto?.countryOfOrigin,
      criminalRecord: updateUserProfileDto?.criminalRecord,
      policeClearenceCertificate: updateUserProfileDto?.policeClearenceCertificate,
      crimes: updateUserProfileDto?.crimes
    })

    await this.usersRepository.save(user)

    const updatedUser = await this.usersService.findOne({
      id: userJwtPayload.id,
    });
    if (!updatedUser) {
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

    if (
      (!!updatedUser.email || !!updatedUser.phoneNumber) &&
      !!updatedUser.gender &&
      !!updatedUser.race &&
      !!updatedUser.homeAddress &&
      !!updatedUser.educationLevel &&
      !!updatedUser.currentActivity &&
      !!updatedUser.fieldOfStudy &&
      !!updatedUser.southAfricanCitizen &&
      !!updatedUser.documentId &&
      !!updatedUser.countryOfOrigin
    ) {
      Object.assign(updatedUser, {
        isProfileComplete: true
      })
      await this.usersRepository.save(updatedUser)
    } else {
      Object.assign(updatedUser, {
        isProfileComplete: false
      })
      await this.usersRepository.save(updatedUser)
    }
    
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
