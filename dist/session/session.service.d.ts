import { User } from 'src/users/domain/user';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { SessionRepository } from './infrastructure/persistence/session.repository';
import { Session } from './domain/session';
import { NullableType } from 'src/utils/types/nullable.type';
export declare class SessionService {
    private readonly sessionRepository;
    constructor(sessionRepository: SessionRepository);
    findOne(options: EntityCondition<Session>): Promise<NullableType<Session>>;
    create(data: Omit<Session, 'id' | 'createdAt' | 'deletedAt'>): Promise<Session>;
    softDelete(criteria: {
        id?: Session['id'];
        user?: Pick<User, 'id'>;
        excludeId?: Session['id'];
    }): Promise<void>;
}
