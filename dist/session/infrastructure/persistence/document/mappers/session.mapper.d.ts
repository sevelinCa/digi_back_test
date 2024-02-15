import { Session } from '../../../../domain/session';
import { SessionSchemaClass } from '../entities/session.schema';
export declare class SessionMapper {
    static toDomain(raw: SessionSchemaClass): Session;
    static toPersistence(session: Session): SessionSchemaClass;
}
