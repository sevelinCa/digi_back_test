"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionMapper = void 0;
const user_schema_1 = require("../../../../../users/infrastructure/persistence/document/entities/user.schema");
const session_1 = require("../../../../domain/session");
const session_schema_1 = require("../entities/session.schema");
const user_mapper_1 = require("../../../../../users/infrastructure/persistence/document/mappers/user.mapper");
class SessionMapper {
    static toDomain(raw) {
        const session = new session_1.Session();
        session.id = raw._id.toString();
        if (raw.user) {
            session.user = user_mapper_1.UserMapper.toDomain(raw.user);
        }
        session.createdAt = raw.createdAt;
        session.deletedAt = raw.deletedAt;
        return session;
    }
    static toPersistence(session) {
        const user = new user_schema_1.UserSchemaClass();
        user._id = session.user.id.toString();
        const sessionEntity = new session_schema_1.SessionSchemaClass();
        if (session.id && typeof session.id === 'string') {
            sessionEntity._id = session.id;
        }
        sessionEntity.user = user;
        sessionEntity.createdAt = session.createdAt;
        sessionEntity.deletedAt = session.deletedAt;
        return sessionEntity;
    }
}
exports.SessionMapper = SessionMapper;
//# sourceMappingURL=session.mapper.js.map