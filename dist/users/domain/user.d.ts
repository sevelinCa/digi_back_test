import { FileType } from 'src/files/domain/file';
import { Role } from 'src/roles/domain/role';
import { Status } from 'src/statuses/domain/status';
export declare class User {
    id: number | string;
    email: string | null;
    password?: string;
    previousPassword?: string;
    provider: string;
    socialId?: string | null;
    firstName: string | null;
    lastName: string | null;
    photo?: FileType | null;
    role?: Role | null;
    status?: Status;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
