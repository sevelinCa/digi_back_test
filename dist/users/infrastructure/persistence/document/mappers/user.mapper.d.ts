import { User } from '../../../../domain/user';
import { UserSchemaClass } from '../entities/user.schema';
export declare class UserMapper {
    static toDomain(raw: UserSchemaClass): User;
    static toPersistence(user: User): UserSchemaClass;
}
