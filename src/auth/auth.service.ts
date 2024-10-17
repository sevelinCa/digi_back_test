import axios from "axios";

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import ms from "ms";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { AuthEmailLoginDto } from "./dto/auth-email-login.dto";
import { AuthUpdateDto } from "./dto/auth-update.dto";
import { RoleEnum } from "src/roles/roles.enum";
import { StatusEnum } from "src/statuses/statuses.enum";
import { AuthProvidersEnum } from "./auth-providers.enum";
import { SocialInterface } from "../social/interfaces/social.interface";
import { AuthRegisterLoginDto } from "./dto/auth-register-login.dto";
import { MailService } from "src/mail/mail.service";
import { NullableType } from "../utils/types/nullable.type";
import { LoginResponseType } from "./types/login-response.type";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "src/config/config.type";
import { JwtRefreshPayloadType } from "./strategies/types/jwt-refresh-payload.type";
import { JwtPayloadType } from "./strategies/types/jwt-payload.type";
import { User } from "src/users/domain/user";
import { Session } from "src/session/domain/session";
import { UsersService } from "src/users/users.service";
import { SessionService } from "src/session/session.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { UserEntity } from "src/users/infrastructure/persistence/relational/entities/user.entity";
import { AuthPhoneRegisterDto } from "./dto/auth-phone-register.dto";
import { SmsService } from "src/sms/sms.service";
import { AuthConfirmPhoneDto } from "./dto/auth-confirm-phone.dto";
import { GoogleCreateUserDto } from "./dto/google-create-user.dto";
import { UserProfileDto } from "src/user/dto/user.profile.dto";
import { AuthPhoneLoginDto } from "./dto/auth-phone-login.dto";
import { FaceBookCreateUserDto } from "./dto/facebook-create-user.dto";
import { CustomerSubscriptionService } from "src/digifranchise-subscription/customer-subscription.service";
import { CustomerSubscription } from "src/digifranchise-subscription/entities/customer-subscription.entity";
import { AuthForgotPasswordForWebSiteDto } from "./dto/auth-forgot-password-on-webs.dto";
import { ForgotPasswordMailData } from "forgot-password-mail-data.interface";
import { Role } from "src/roles/domain/role";
import { RoleEntity } from "src/roles/infrastructure/persistence/relational/entities/role.entity";
import { DigifranchiseCustomers } from "src/digifranchise-customers/entities/customers.entity";
import { DigifranchiseCustomersAccessControl } from "src/digifranchise-customers/entities/digifranchise-customers-access-control.entity";
import { StatusEntity } from "src/statuses/infrastructure/persistence/relational/entities/status.entity";

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
    private readonly usersRepository: Repository<User>,
    @InjectRepository(DigifranchiseCustomers)
    private readonly digifranchiseCustomersRepository: Repository<DigifranchiseCustomers>,
    @InjectRepository(DigifranchiseCustomersAccessControl)
    private readonly digifranchiseCustomerAccessControlRepository: Repository<DigifranchiseCustomersAccessControl>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseType> {
    const user = await this.usersService.findOne({ email: loginDto.email });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { email: "notFound" },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (user.role?.id !== RoleEnum.digifranchise_super_admin) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: { role: "notAllowed" },
        },
        HttpStatus.FORBIDDEN
      );
    }

    if (user.status?.id !== StatusEnum.active) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: { role: "verify your email or contact super admin" },
        },
        HttpStatus.FORBIDDEN
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { email: `needLoginViaProvider:${user.provider}` },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (!user.password) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { password: "incorrectPassword" },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { password: "incorrectPassword" },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const session = await this.sessionService.create({ user });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    let csrfToken: string;
    let cookies: string = "";
    try {
      const csrfResponse = await axios.get(
        `${this.configService.get<string>("ACADEMY_API_BASE_URL")}${this.configService.get<string>("ACADEMY_CSRF_TOKEN_ENDPOINT")}`,
        { withCredentials: true }
      );
      csrfToken = csrfResponse.data.csrfToken;
      cookies = csrfResponse.headers["set-cookie"]?.join("; ") || "";
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { login: "AcademyCSRFTokenFetchFailed" },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    try {
      const academyResponse = await axios.post(
        `${this.configService.get<string>("ACADEMY_API_BASE_URL")}${this.configService.get<string>("ACADEMY_LOGIN_ENDPOINT")}`,
        new URLSearchParams({
          email: loginDto.email,
          next: "/",
          password: loginDto.password,
        }),
        {
          headers: {
            "x-csrftoken": csrfToken,
            origin: this.configService.get<string>("ACADEMY_ORIGIN_URL"),
            "Content-Type": "application/x-www-form-urlencoded",
            Cookie: cookies,
          },
          withCredentials: true,
        }
      );

      const academyData = academyResponse.data;

      if (!academyData.success) {
        return {
          refreshToken,
          token,
          tokenExpires,
          user,
          success: false,
          message: "Academy login failed",
        };
      }

      return {
        refreshToken,
        token,
        tokenExpires,
        user,
        academy_jwt_token: academyData.jwt_token,
        academy_bearer_token: academyData.bearer_token,
        success: true,
        message: "Login successful",
      };
    } catch (error) {
      return {
        refreshToken,
        token,
        tokenExpires,
        user,
        success: false,
        message: "Academy login failed",
      };
    }
  }

  async customerEmailLogin(
    digifranchiseId: string,
    loginDto: AuthEmailLoginDto
  ): Promise<LoginResponseType> {
    const user = await this.digifranchiseCustomersRepository.findOne({
      where: { email: loginDto.email },
      relations: ["status"],
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: "notFound",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (user?.status?.id !== StatusEnum.active) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: { role: "verify your email or contact super admin" },
        },
        HttpStatus.FORBIDDEN
      );
    }

    const checkExistingCustomer =
      await this.digifranchiseCustomerAccessControlRepository.findOne({
        where: { digifranchiseId, customerId: user.id },
      });

    // console.log('*********', checkExistingCustomer)

    if (!checkExistingCustomer) {
      throw new HttpException(
        "user is not signed up to this digifranchise",
        HttpStatus.CONFLICT
      );
    }

    // if (user.status?.id !== StatusEnum.active) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       errors: { role: "verify your email or contact super admin" },
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      checkExistingCustomer.password
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: "incorrectPassword",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // const session = await this.sessionService.create({
    //   user,
    // });

    // const getCustomerSubscriptions =
    //   await this.customerSubscription.getAllSubscriptions(user.id);

    // getCustomerSubscriptions.map(async (subscription: CustomerSubscription) => {
    //   if (subscription.digifranchiseOwnerId.id === digifranchiseId) {
    //     return;
    //   } else {
    //     await this.customerSubscription.createSubscription(
    //       user.id,
    //       digifranchiseId,
    //     );
    //   }
    // });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      // role: RoleEnum.customer,
      // sessionId: session.id,
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
      if (user.role?.id !== RoleEnum.digifranchise_super_admin) {
        throw new HttpException(
          "Only users with the digifranchise_super_admin role can log in through this method.",
          HttpStatus.FORBIDDEN
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
    } else {
      const newUser = await this.usersRepository.save(
        this.usersRepository.create({
          ...googleUser,
          role: {
            id: RoleEnum.digifranchise_super_admin,
          },
          status: {
            id: StatusEnum.active,
          },
          image: googleUser.profilePic,
          provider: "google",
        })
      );

      const user = await this.usersRepository.findOne({
        where: { email: newUser.email as string },
      });

      if (user) {
        if (user.role?.id !== RoleEnum.digifranchise_super_admin) {
          throw new HttpException(
            "Only users with the digifranchise_super_admin role can log in through this method.",
            HttpStatus.FORBIDDEN
          );
        }

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
        };
      }
    }
  }

  async googleAuthCustomer(
    ownedDigifranchiseId: string,
    googleUser: GoogleCreateUserDto
  ): Promise<any> {
    const existingUserWithDifferentProvider =
      await this.usersRepository.findOne({
        where: { email: googleUser.email as string, provider: Not("google") },
      });

    if (existingUserWithDifferentProvider) {
      throw new HttpException(
        "An account with this email address already exists, Please log in or use a different email address.",
        HttpStatus.CONFLICT
      );
    }

    const user = await this.usersRepository.findOne({
      where: { email: googleUser.email as string, provider: "google" },
    });

    if (user) {
      if (user.role?.id !== RoleEnum.customer) {
        throw new HttpException(
          "Only users with the customer role can log in through this method.",
          HttpStatus.FORBIDDEN
        );
      }

      const session = await this.sessionService.create({
        user,
      });

      const getCustomerSubscriptions =
        await this.customerSubscription.getAllSubscriptions(user.id);

      getCustomerSubscriptions.map(
        async (subscription: CustomerSubscription) => {
          if (subscription.digifranchiseOwnerId.id === ownedDigifranchiseId) {
            return;
          } else {
            await this.customerSubscription.createSubscription(
              user.id,
              ownedDigifranchiseId
            );
          }
        }
      );

      const { token, refreshToken, tokenExpires } =
        await this.getTokensDataForGoogle({
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
            id: RoleEnum.customer,
          },
          status: {
            id: StatusEnum.active,
          },
          image: googleUser.profilePic,
          provider: "google",
        })
      );

      const user = await this.usersRepository.findOne({
        where: { email: newUser.email as string },
      });

      if (user) {
        if (user.role?.id !== RoleEnum.customer) {
          throw new HttpException(
            "Only users with the customer role can log in through this method.",
            HttpStatus.FORBIDDEN
          );
        }

        const session = await this.sessionService.create({
          user,
        });

        const getCustomerSubscriptions =
          await this.customerSubscription.getAllSubscriptions(user.id);

        getCustomerSubscriptions.map(
          async (subscription: CustomerSubscription) => {
            if (subscription.digifranchiseOwnerId.id === ownedDigifranchiseId) {
              return;
            } else {
              await this.customerSubscription.createSubscription(
                user.id,
                ownedDigifranchiseId
              );
            }
          }
        );

        const { token, refreshToken, tokenExpires } =
          await this.getTokensDataForGoogle({
            id: user.id,
            role: newUser.role,
            sessionId: session.id,
          });

        return {
          refreshToken,
          token,
          tokenExpires,
          newUser,
        };
      }
    }
  }

  async getCsrfToken(): Promise<string> {
    const response = await axios.get(
      `${this.configService.get("ACADEMY_API_BASE_URL")}${this.configService.get("ACADEMY_CSRF_TOKEN_ENDPOINT")}`
    );

    return response.data.token;
  }

  async register(
    dto: AuthRegisterLoginDto
  ): Promise<{ user: User; academyError: string | null }> {
    const csrfToken = await this.getCsrfToken();

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
      isProfileComplete: false,
    });

    const externalRegistrationData = {
      email: dto.email,
      name: `${dto.firstName} ${dto.lastName}`,
      next: "/",
      username: `${dto.lastName}${Math.floor(Math.random() * 10000)}`,
      password: dto.password,
    };

    let academyError: string | null = null;

    try {
      await axios.post(
        `${this.configService.get("ACADEMY_API_BASE_URL")}${this.configService.get("ACADEMY_REGISTER_ENDPOINT")}`,
        new URLSearchParams(externalRegistrationData).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": csrfToken,
          },
        }
      );
    } catch (error) {
      academyError = "AcademyRegisterFailed";
    }

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow("auth.confirmEmailExpires", {
          infer: true,
        }),
      }
    );

    await this.mailService.userSignUp({
      to: dto.email,
      data: {
        hash,
      },
    });

    return { user, academyError };
  }

  async customerRegister(
    digifranchiseId: string,
    dto: AuthRegisterLoginDto,
    websiteURL: string
  ): Promise<void> {
    try {
      const checkExistingCustomer =
        await this.digifranchiseCustomersRepository.findOne({
          where: {
            email: dto.email,
          },
        });

      const existingCustomerInDigifranchise =
        await this.digifranchiseCustomerAccessControlRepository.findOne({
          where: {
            digifranchiseId: digifranchiseId,
            customerId: checkExistingCustomer?.id,
          },
        });

      if (checkExistingCustomer && existingCustomerInDigifranchise) {
        throw new HttpException(
          "User with this email is already signed up to this DigiFranchise.",
          HttpStatus.CONFLICT
        );
      }

      let customerIdToConfirm: string;
      let newCustomer: any;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      if (checkExistingCustomer) {
        await this.digifranchiseCustomerAccessControlRepository.save(
          this.digifranchiseCustomerAccessControlRepository.create({
            customerId: checkExistingCustomer.id,
            digifranchiseId: digifranchiseId,
            password: hashedPassword,
          })
        );

        customerIdToConfirm = checkExistingCustomer.id;
      } else {
        newCustomer = this.digifranchiseCustomersRepository.create({
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          status: {
            id: StatusEnum.inactive,
          },
        });

        await this.digifranchiseCustomersRepository.save(newCustomer);

        await this.digifranchiseCustomerAccessControlRepository.save(
          this.digifranchiseCustomerAccessControlRepository.create({
            customerId: newCustomer.id,
            digifranchiseId: digifranchiseId,
            password: hashedPassword,
          })
        );

        customerIdToConfirm = newCustomer.id;
      }

      const hash = await this.jwtService.signAsync(
        { confirmEmailUserId: customerIdToConfirm },
        {
          secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.confirmEmailExpires", {
            infer: true,
          }),
        }
      );

      await this.mailService.customerSignUp({
        to: dto.email,
        data: {
          hash,
          websiteUrl: websiteURL,
        },
      });
    } catch (error) {
      throw new HttpException(
        error.response || "An error occurred during registration.",
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User["id"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User["id"];
      }>(hash, {
        secret: this.configService.getOrThrow("auth.confirmEmailSecret", {
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
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const user = await this.usersService.findOne({ id: userId });

    if (user) {
      if (user?.status?.id === StatusEnum.inactive) {
        const updatedStatus = { id: StatusEnum.active };
        Object.assign(user, { status: updatedStatus.id });
        await this.usersRepository.save(user);
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `notFound`,
          },
          HttpStatus.NOT_FOUND
        );
      }
    } else {
      const customer: any = await this.digifranchiseCustomersRepository.findOne(
        {
          where: { id: userId },
          relations: ["status"],
        }
      );

      if (customer) {
        if (customer?.status?.id === StatusEnum.inactive) {
          const activeStatus = new StatusEntity();
          activeStatus.id = StatusEnum.active;
          customer.status = activeStatus;
          await this.digifranchiseCustomersRepository.save(customer);
        } else {
          const activeStatus = new StatusEntity();
          activeStatus.id = StatusEnum.active;
          customer.status = activeStatus;
          await this.digifranchiseCustomersRepository.save(customer);
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `notFound`,
          },
          HttpStatus.NOT_FOUND
        );
      }
    }
  }

  async phoneRegister(dto: AuthPhoneRegisterDto) {
    const { phoneNumber } = dto;
    const users = await this.usersService.findOne({ phoneNumber });
    if (users) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          errors: {
            message: "Phone number already exists",
          },
        },
        HttpStatus.CONFLICT
      );
    }
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
      isProfileComplete: false,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          errors: {
            phoneNumber: "failedToCreatUser",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (user) {
      try {
        await this.smsService.sendOTP(dto.phoneNumber);
      } catch (error) {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            errors: {
              phoneNumber: "failed to send SMS",
              message: "user has been created but unable to SMS at this time",
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
    }
  }

  async phoneCustomerRegister(
    digifranchiseId: string,
    dto: AuthPhoneRegisterDto
  ) {
    try {
      const { phoneNumber } = dto;

      const existingCustomer =
        await this.digifranchiseCustomersRepository.findOne({
          where: { phoneNumber },
        });

      let customerId: string;

      if (existingCustomer) {
        const existingAccessControl =
          await this.digifranchiseCustomerAccessControlRepository.findOne({
            where: {
              customerId: existingCustomer.id,
              digifranchiseId: digifranchiseId,
            },
          });

        if (existingAccessControl) {
          throw new HttpException(
            "User with this phone number is already signed up to this digifranchise.",
            HttpStatus.CONFLICT
          );
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        await this.digifranchiseCustomerAccessControlRepository.save(
          this.digifranchiseCustomerAccessControlRepository.create({
            customerId: existingCustomer.id,
            digifranchiseId: digifranchiseId,
            password: hashedPassword,
          })
        );
        customerId = existingCustomer.id;
      } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const newCustomer = this.digifranchiseCustomersRepository.create({
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          status: {
            id: StatusEnum.inactive,
          },
        });

        await this.digifranchiseCustomersRepository.save(newCustomer);
        customerId = newCustomer.id;

        await this.digifranchiseCustomerAccessControlRepository.save(
          this.digifranchiseCustomerAccessControlRepository.create({
            customerId: newCustomer.id,
            digifranchiseId: digifranchiseId,
            password: hashedPassword,
          })
        );
      }

      await this.smsService.sendOTP(dto.phoneNumber);
    } catch (error) {
      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
            phone: "notFound",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
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
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (user.status?.id !== StatusEnum.active) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: { role: "verify your phone or contact super admin" },
        },
        HttpStatus.FORBIDDEN
      );
    }

    if (!user.password) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: "incorrectPassword",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.password);

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: "incorrectPassword",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
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

  async customerPhoneLogin(
    digifranchiseId: string,
    dto: AuthPhoneLoginDto
  ): Promise<LoginResponseType> {
    const user = await this.digifranchiseCustomersRepository.findOne({
      where: { phoneNumber: dto.phoneNumber },
      relations: ["status"],
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            phone: "notFound",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (user.status?.id !== StatusEnum.active) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          errors: { role: "verify your phone or contact super admin" },
        },
        HttpStatus.FORBIDDEN
      );
    }

    const checkExistingCustomer =
      await this.digifranchiseCustomerAccessControlRepository.findOne({
        where: { digifranchiseId, customerId: user.id },
      });

    if (!checkExistingCustomer) {
      throw new HttpException(
        "user is not signed up to this digifranchise",
        HttpStatus.CONFLICT
      );
    }

    // if (user.provider !== AuthProvidersEnum.phone) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       errors: {
    //         email: `needLoginViaProvider:${user.provider}`,
    //       },
    //     },
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }

    // if (!user.password) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNPROCESSABLE_ENTITY,
    //       errors: {
    //         password: "incorrectPassword",
    //       },
    //     },
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }

    // if (user.status?.id !== StatusEnum.active) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.FORBIDDEN,
    //       errors: { role: "verify your phone or contact super admin" },
    //     },
    //     HttpStatus.FORBIDDEN,
    //   );
    // }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      checkExistingCustomer.password
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: "incorrectPassword",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    // const session = await this.sessionService.create({
    //   user,
    // });

    // const getCustomerSubscriptions =
    //   await this.customerSubscription.getAllSubscriptions(user.id);

    // getCustomerSubscriptions.map(async (subscription: CustomerSubscription) => {
    //   if (subscription.digifranchiseOwnerId.id === digifranchiseId) {
    //     return;
    //   } else {
    //     await this.customerSubscription.createSubscription(
    //       user.id,
    //       digifranchiseId,
    //     );
    //   }
    // });

    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      // role: user.role,
      // sessionId: session.id,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  async verifyUserWithPhone(dto: AuthConfirmPhoneDto) {
    const phoneIsVerified = await this.smsService.verifyOTP(
      dto.phoneNumber,
      dto.otp
    );

    if (phoneIsVerified) {
      const user = await this.usersService.findOne({
        phoneNumber: dto.phoneNumber,
      });
      if (!user || user?.status?.id !== StatusEnum.inactive) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: `notFound`,
          },
          HttpStatus.NOT_FOUND
        );
      }

      const updatedStatus = {
        id: StatusEnum.active,
      };
      Object.assign(user, { status: updatedStatus.id });
      await this.usersRepository.save(user);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Wrong otp",
        },
        HttpStatus.BAD_REQUEST
      );
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
            email: "email does not exist",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow("auth.forgotSecret", {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow("auth.forgotExpires", {
          infer: true,
        }),
      }
    );

    await this.mailService.forgotPassword({
      to: email,
      data: {
        hash,
      },
    });
  }

  async forgetPasswordForWebs(
    dto: AuthForgotPasswordForWebSiteDto
  ): Promise<void> {
    let entityType = "user";
    let entity: any = await this.usersService.findOne({
      email: dto.email,
    });

    if (!entity) {
      entityType = "customer";
      entity = await this.digifranchiseCustomersRepository.findOne({
        where: { email: dto.email },
      });

      if (!entity) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: "email does not exist",
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
    }

    const hash = await this.jwtService.signAsync(
      {
        forgotUserId: entity.id,
      },
      {
        secret: this.configService.getOrThrow("auth.forgotSecret", {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow("auth.forgotExpires", {
          infer: true,
        }),
      }
    );

    await this.mailService.forgotPasswordForWebs({
      to: dto.email,
      data: {
        hash,
        websiteUrl: dto.websiteURL,
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
            phone: "phone does not exist",
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    await this.smsService.sendOTP(phoneNumber);

    return { message: "otp sent to phone, check messages" };
  }

  async resetPasswordWithPhone(
    otp: string,
    phoneNumber: string,
    newPassword: string
  ): Promise<any> {
    const phoneIsVerified = await this.smsService.verifyOTP(phoneNumber, otp);

    if (!phoneIsVerified) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `otpExpired`,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    if (phoneIsVerified) {
      const user = await this.usersService.findOne({ phoneNumber });
      if (user) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        Object.assign(user, { password: hashedPassword });
        await this.usersRepository.save(user);
        return {
          status: HttpStatus.OK,
          message: "Password successfully reset for user",
        };
      }

      const customerUser: any =
        await this.digifranchiseCustomersRepository.findOne({
          where: { phoneNumber: phoneNumber },
        });
      const customer =
        await this.digifranchiseCustomerAccessControlRepository.findOne({
          where: { customerId: customerUser.id },
        });
      if (customer) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        Object.assign(customer, { password: hashedPassword });
        await this.digifranchiseCustomerAccessControlRepository.save(customer);
        return {
          status: HttpStatus.OK,
          message: "Password successfully reset for user",
        };
      }

      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND
      );
    }
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    let userId: User["id"];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        forgotUserId: string;
      }>(hash, {
        secret: this.configService.getOrThrow("auth.forgotSecret", {
          infer: true,
        }),
      });

      userId = jwtData.forgotUserId;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { hash: `invalidHash` },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const user = await this.usersService.findOne({ id: userId });
    if (user) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      Object.assign(user, { password: hashedPassword });
      await this.usersRepository.save(user);
      return;
    }

    const customer =
      await this.digifranchiseCustomerAccessControlRepository.findOne({
        where: { customerId: userId },
      });
    if (customer) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      Object.assign(customer, { password: hashedPassword });
      await this.digifranchiseCustomerAccessControlRepository.save(customer);
      return;
    }

    throw new HttpException(
      { status: HttpStatus.UNPROCESSABLE_ENTITY, errors: { hash: `notFound` } },
      HttpStatus.UNPROCESSABLE_ENTITY
    );
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    const user = await this.usersService.findOne({
      id: userJwtPayload.id,
    });
    if (user) {
      return user;
    }
    const customer: any = await this.digifranchiseCustomersRepository.findOne({
      where: { id: userJwtPayload.id },
    });
    return customer;
  }

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserProfileDto: UserProfileDto
  ): Promise<void> {
    let user: any = await this.usersService.findOne({
      id: userJwtPayload.id,
    });

    let customer: any = null;

    if (!user) {
      customer = await this.digifranchiseCustomersRepository.findOne({
        where: { id: userJwtPayload.id },
      });

      if (!customer) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              hash: `notFound`,
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
    }

    if (
      updateUserProfileDto.email &&
      updateUserProfileDto.email.trim().length > 0
    ) {
      const existingEntity: any = await (user
        ? this.usersService.findOne({ email: updateUserProfileDto.email })
        : this.digifranchiseCustomersRepository.findOne({
            where: { email: updateUserProfileDto.email },
          }));

      if (existingEntity && existingEntity.id !== userJwtPayload.id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: "email already exists",
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
    }

    if (
      updateUserProfileDto.phoneNumber &&
      updateUserProfileDto.phoneNumber.trim().length > 0
    ) {
      const existingEntity: any = await (user
        ? this.usersService.findOne({
            phoneNumber: updateUserProfileDto.phoneNumber,
          })
        : this.digifranchiseCustomersRepository.findOne({
            where: { phoneNumber: updateUserProfileDto.phoneNumber },
          }));

      if (existingEntity && existingEntity.id !== userJwtPayload.id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              phoneNumber: "phone number already exists",
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }
    }

    if (user) {
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
        dateOfBirth: updateUserProfileDto?.dateOfBirth,
        documentId: updateUserProfileDto?.documentId,
        countryOfOrigin: updateUserProfileDto?.countryOfOrigin,
        criminalRecord: updateUserProfileDto?.criminalRecord,
        policeClearenceCertificate:
          updateUserProfileDto?.policeClearenceCertificate,
        crimes: updateUserProfileDto?.crimes,
      });

      await this.usersRepository.save(user);
    }

    if (customer) {
      Object.assign(customer, {
        firstName: updateUserProfileDto?.firstName,
        lastName: updateUserProfileDto?.lastName,
        email: updateUserProfileDto?.email,
        phoneNumber: updateUserProfileDto?.phoneNumber,
      });

      await this.digifranchiseCustomersRepository.save(customer);
    }

    const updatedEntity: any = user
      ? await this.usersService.findOne({ id: userJwtPayload.id })
      : await this.digifranchiseCustomersRepository.findOne({
          where: { id: userJwtPayload.id },
        });

    if (!updatedEntity) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (user) {
      if (
        (!!updatedEntity.email || !!updatedEntity.phoneNumber) &&
        !!updatedEntity.gender &&
        !!updatedEntity.race &&
        !!updatedEntity.homeAddress &&
        !!updatedEntity.educationLevel &&
        !!updatedEntity.currentActivity &&
        !!updatedEntity.fieldOfStudy &&
        !!updatedEntity.southAfricanCitizen &&
        !!updatedEntity.documentId &&
        !!updatedEntity.countryOfOrigin
      ) {
        Object.assign(updatedEntity, { isProfileComplete: true });
      } else {
        Object.assign(updatedEntity, { isProfileComplete: false });
      }

      await this.usersRepository.save(updatedEntity);
    }
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, "sessionId">
  ): Promise<Omit<LoginResponseType, "user">> {
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

  async logout(data: Pick<JwtRefreshPayloadType, "sessionId">) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  private async getTokensData(data: {
    id: User["id"];
    role?: User["role"];
    sessionId?: Session["id"];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow("auth.expires", {
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
          secret: this.configService.getOrThrow("auth.secret", { infer: true }),
          expiresIn: tokenExpiresIn,
        }
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow("auth.refreshSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.refreshExpires", {
            infer: true,
          }),
        }
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }

  private async getTokensDataForGoogle(data: {
    id: User["id"];
    role: User["role"];
    sessionId: Session["id"];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow("auth.expires", {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    // Fetch the full RoleEntity using the role ID
    if (!data.role) {
      throw new Error("Role is not defined"); // Or handle this case differently
    }

    const roleEntity = await this.roleRepository.findOne({
      where: { id: data.role.id },
    });

    if (!roleEntity) {
      throw new Error("Role entity not found");
    }

    const tokenPayload = {
      id: data.id,
      role: {
        id: roleEntity.id,
        name: roleEntity.name,
        __entity: roleEntity,
      },
      sessionId: data.sessionId,
    };

    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(tokenPayload, {
        secret: this.configService.getOrThrow("auth.secret", { infer: true }),
        expiresIn: tokenExpiresIn,
      }),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow("auth.refreshSecret", {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow("auth.refreshExpires", {
            infer: true,
          }),
        }
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
