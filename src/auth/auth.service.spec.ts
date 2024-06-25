import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { MailService } from 'src/mail/mail.service';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/domain/user';
import { SessionService } from 'src/session/session.service'; 
import { CustomerSubscriptionService } from 'src/digifranchise-subscription/customer-subscription.service';
import { SmsService } from 'src/sms/sms.service';

jest.mock('axios');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let mailService: MailService;
  let configService: ConfigService;
  let sessionService: SessionService;
  let customerSubscriptionService: CustomerSubscriptionService;



  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a user and return user and null academyError', async () => {
    const dto: AuthRegisterLoginDto = {
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    const createdUser: User = {
      id: '123',
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
      role: { id: RoleEnum.digifranchise_super_admin },
      status: { id: StatusEnum.inactive },
      phoneNumber: '',
      provider: '',
      image: '',
      idImage: '',
      gender: '',
      race: '',
      homeAddress: '',
      educationLevel: '',
      currentActivity: '',
      fieldOfStudy: '',
      qualifications: [],
      professionalBody: [
        {
          professionalBody: 'Mock Body 1',
          certificateName: '',
          certificateCopy: '',
          dateObtained: new Date(),
          expiryDate: new Date(),
        },
        {
          professionalBody: 'Mock Body 2',
          certificateName: '',
          certificateCopy: '',
          dateObtained: new Date(),
          expiryDate: new Date(),
        },
      ],
      southAfricanCitizen: false,
      documentId: '',
      countryOfOrigin: '',
      criminalRecord: false,
      policeClearenceCertificate: '',
      crimes: [],
      isProfileComplete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      deleteAt: null,
    };
    const csrfToken = 'csrf-token';
    const jwtHash = 'jwt-hash';

    jest.spyOn(service, 'getCsrfToken').mockResolvedValue(csrfToken);
    jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);
    jest.spyOn(axios, 'post').mockResolvedValue({});
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(jwtHash);
    jest.spyOn(mailService, 'userSignUp').mockResolvedValue(undefined);
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      const config = {
        ACADEMY_API_BASE_URL: 'http://example.com',
        ACADEMY_REGISTER_ENDPOINT: '/register',
      };
      return config[key];
    });

    const result = await service.register(dto);

    expect(service.getCsrfToken).toHaveBeenCalled();
    expect(usersService.create).toHaveBeenCalledWith(expect.objectContaining({
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
    }));
    expect(axios.post).toHaveBeenCalledWith(
      'http://example.com/register',
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken,
        },
      }),
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith(
      { confirmEmailUserId: createdUser.id },
      expect.any(Object),
    );
    expect(mailService.userSignUp).toHaveBeenCalledWith({
      to: dto.email,
      data: { hash: jwtHash },
    });
    expect(result).toEqual({ user: createdUser, academyError: null });
  });

  it('should handle an error from external registration and return academyError', async () => {
    const dto: AuthRegisterLoginDto = {
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    const createdUser: User = {
      id: '123',
      email: 'test@example.com',
      password: 'Password123',
      firstName: 'John',
      lastName: 'Doe',
      role: { id: RoleEnum.digifranchise_super_admin },
      status: { id: StatusEnum.inactive },
      phoneNumber: '',
      provider: '',
      image: '',
      idImage: '',
      gender: '',
      race: '',
      homeAddress: '',
      educationLevel: '',
      currentActivity: '',
      fieldOfStudy: '',
      qualifications: [],
      professionalBody: [
        {
          professionalBody: 'Mock Body 1',
          certificateName: '',
          certificateCopy: '',
          dateObtained: new Date(),
          expiryDate: new Date(),
        },
        {
          professionalBody: 'Mock Body 2',
          certificateName: '',
          certificateCopy: '',
          dateObtained: new Date(),
          expiryDate: new Date(),
        },
      ],
      southAfricanCitizen: false,
      documentId: '',
      countryOfOrigin: '',
      criminalRecord: false,
      policeClearenceCertificate: '',
      crimes: [],
      isProfileComplete: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
      deleteAt: null,
    };
    const csrfToken = 'csrf-token';
    const jwtHash = 'jwt-hash';

    jest.spyOn(service, 'getCsrfToken').mockResolvedValue(csrfToken);
    jest.spyOn(usersService, 'create').mockResolvedValue(createdUser);
    jest.spyOn(axios, 'post').mockRejectedValue(new Error('External registration failed'));
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(jwtHash);
    jest.spyOn(mailService, 'userSignUp').mockResolvedValue(undefined);
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      const config = {
        ACADEMY_API_BASE_URL: 'http://example.com',
        ACADEMY_REGISTER_ENDPOINT: '/register',
      };
      return config[key];
    });

    const result = await service.register(dto);

    expect(result).toEqual({ user: createdUser, academyError: 'AcademyRegisterFailed' });
  });
});
