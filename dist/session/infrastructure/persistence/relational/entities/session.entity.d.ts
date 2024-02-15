import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EntityRelationalHelper } from 'src/utils/relational-entity-helper';
import { Session } from '../../../../domain/session';
export declare class SessionEntity extends EntityRelationalHelper implements Session {
    id: number;
    user: UserEntity;
    createdAt: Date;
    deletedAt: Date;
}
