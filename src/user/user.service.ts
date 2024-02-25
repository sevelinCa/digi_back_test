import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/domain/user';
import { FilterUserDto, SortUserDto } from 'src/users/dto/query-user.dto';
import { UserRepository } from 'src/users/infrastructure/persistence/user.repository';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Repository } from 'typeorm';
import { UserProfileDto } from './dto/user.profile.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';

@Injectable()
export class UserService {
    constructor(
        private readonly usersRepository: UserRepository,
        private usersService: UsersService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<User>
    ) {}

    async createProfile(
        userJwtPayload: JwtPayloadType,
        // userId: string,
        createUserProfileDto: UserProfileDto,
      ) {
        // let userId: User['id'];

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

        if (createUserProfileDto.email) {
            const userObject = await this.usersRepository.findOne({
              email: createUserProfileDto.email,
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

        if (createUserProfileDto.mobileNumber) {
            const userObject = await this.usersRepository.findOne({
                phoneNumber: createUserProfileDto.mobileNumber,
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
            image: createUserProfileDto?.image,
            email: createUserProfileDto?.email,
            firstName: createUserProfileDto?.firstName,
            lastName: createUserProfileDto?.lastName,
            idImage: createUserProfileDto?.idImage,
            gender: createUserProfileDto?.gender,
            race: createUserProfileDto?.race,
            homeAddress: createUserProfileDto?.homeAddress,
            phoneNumber: createUserProfileDto?.mobileNumber,
            educationLevel: createUserProfileDto?.educationLevel,
            currentActivity: createUserProfileDto?.currentActivity,
            fieldOfStudy: createUserProfileDto?.fieldOfStudy,
            qualifications: createUserProfileDto?.qualifications,
            professionalBody: createUserProfileDto?.professionalBody,
            isProfileComplete: true,
        })

        await this.userRepository.save(user)
    }

    findManyWithPagination({
        filterOptions,
        sortOptions,
        paginationOptions,
    }: {
        filterOptions?: FilterUserDto | null;
        sortOptions?: SortUserDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<User[]> {
        return this.usersRepository.findManyWithPagination({
          filterOptions,
          sortOptions,
          paginationOptions,
        });
    }

    findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
        return this.usersRepository.findOne(fields);
    }

    async updateProfile(
        userJwtPayload: JwtPayloadType,
        updateUserProfileDto: UserProfileDto,
      ) {
        // let userId: User['id'];

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
            const userObject = await this.usersRepository.findOne({
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
            const userObject = await this.usersRepository.findOne({
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

        await this.userRepository.save(user)
    }

    async softDelete(id: User['id']): Promise<void> {
        await this.usersRepository.softDelete(id);
    }
}
