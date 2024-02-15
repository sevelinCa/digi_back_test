import { RoleDto } from 'src/roles/dto/role.dto';
import { StatusDto } from 'src/statuses/dto/status.dto';
import { FileDto } from 'src/files/dto/file.dto';
export declare class CreateUserDto {
    email: string | null;
    password?: string;
    provider?: string;
    socialId?: string | null;
    firstName: string | null;
    lastName: string | null;
    photo?: FileDto | null;
    role?: RoleDto | null;
    status?: StatusDto;
    hash?: string | null;
}
