import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { FilterUserDto, SortUserDto } from './dto/query-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { User } from './domain/user';
import { FilesService } from 'src/files/files.service';
export declare class UsersService {
    private readonly usersRepository;
    private readonly filesService;
    constructor(usersRepository: UserRepository, filesService: FilesService);
    create(createProfileDto: CreateUserDto): Promise<User>;
    findManyWithPagination({ filterOptions, sortOptions, paginationOptions, }: {
        filterOptions?: FilterUserDto | null;
        sortOptions?: SortUserDto[] | null;
        paginationOptions: IPaginationOptions;
    }): Promise<User[]>;
    findOne(fields: EntityCondition<User>): Promise<NullableType<User>>;
    update(id: User['id'], payload: DeepPartial<User>): Promise<User | null>;
    softDelete(id: User['id']): Promise<void>;
}
