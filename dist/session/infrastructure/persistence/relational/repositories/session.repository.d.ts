import { Repository } from 'typeorm';
import { SessionEntity } from '../entities/session.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';
import { User } from 'src/users/domain/user';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
export declare class SessionRelationalRepository implements SessionRepository {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<SessionEntity>);
    findOne(options: EntityCondition<Session>): Promise<NullableType<Session>>;
    create(data: Session): Promise<Session>;
    softDelete({ excludeId, ...criteria }: {
        id?: Session['id'];
        user?: Pick<User, 'id'>;
        excludeId?: Session['id'];
    }): Promise<void>;
}
