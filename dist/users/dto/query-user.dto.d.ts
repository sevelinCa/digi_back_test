import { User } from '../domain/user';
import { RoleDto } from 'src/roles/dto/role.dto';
export declare class FilterUserDto {
    roles?: RoleDto[] | null;
}
export declare class SortUserDto {
    orderBy: keyof User;
    order: string;
}
export declare class QueryUserDto {
    page: number;
    limit: number;
    filters?: FilterUserDto | null;
    sort?: SortUserDto[] | null;
}
