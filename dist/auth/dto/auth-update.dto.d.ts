import { FileDto } from 'src/files/dto/file.dto';
export declare class AuthUpdateDto {
    photo?: FileDto;
    firstName?: string;
    lastName?: string;
    password?: string;
    oldPassword?: string;
}
