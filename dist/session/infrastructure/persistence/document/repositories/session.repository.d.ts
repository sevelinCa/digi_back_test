/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { NullableType } from '../../../../../utils/types/nullable.type';
import { SessionRepository } from '../../session.repository';
import { Session } from '../../../../domain/session';
import { SessionSchemaClass } from '../entities/session.schema';
import { Model } from 'mongoose';
import { User } from 'src/users/domain/user';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
export declare class SessionDocumentRepository implements SessionRepository {
    private sessionModel;
    constructor(sessionModel: Model<SessionSchemaClass>);
    findOne(fields: EntityCondition<Session>): Promise<NullableType<Session>>;
    create(data: Session): Promise<Session>;
    softDelete({ excludeId, ...criteria }: {
        id?: Session['id'];
        user?: Pick<User, 'id'>;
        excludeId?: Session['id'];
    }): Promise<void>;
}
