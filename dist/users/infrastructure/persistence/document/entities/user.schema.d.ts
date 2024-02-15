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
import { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/domain/role';
import { Status } from 'src/statuses/domain/status';
import { EntityDocumentHelper } from 'src/utils/document-entity-helper';
import { FileSchemaClass } from 'src/files/infrastructure/persistence/document/entities/file.schema';
export type UserSchemaDocument = HydratedDocument<UserSchemaClass>;
export declare class UserSchemaClass extends EntityDocumentHelper {
    email: string | null;
    password?: string;
    previousPassword?: string;
    provider: string;
    socialId?: string | null;
    firstName: string | null;
    lastName: string | null;
    photo?: FileSchemaClass | null;
    role?: Role | null;
    status?: Status;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<UserSchemaClass, import("mongoose").Model<UserSchemaClass, any, any, any, import("mongoose").Document<unknown, any, UserSchemaClass> & UserSchemaClass & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserSchemaClass, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserSchemaClass>> & import("mongoose").FlatRecord<UserSchemaClass> & Required<{
    _id: string;
}>>;
