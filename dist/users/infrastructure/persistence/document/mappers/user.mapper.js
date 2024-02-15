"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_1 = require("../../../../domain/user");
const user_schema_1 = require("../entities/user.schema");
const file_schema_1 = require("../../../../../files/infrastructure/persistence/document/entities/file.schema");
const status_1 = require("../../../../../statuses/domain/status");
const role_1 = require("../../../../../roles/domain/role");
const file_mapper_1 = require("../../../../../files/infrastructure/persistence/document/mappers/file.mapper");
class UserMapper {
    static toDomain(raw) {
        const user = new user_1.User();
        user.id = raw._id.toString();
        user.email = raw.email;
        user.password = raw.password;
        user.previousPassword = raw.previousPassword;
        user.provider = raw.provider;
        user.socialId = raw.socialId;
        user.firstName = raw.firstName;
        user.lastName = raw.lastName;
        if (raw.photo) {
            user.photo = file_mapper_1.FileMapper.toDomain(raw.photo);
        }
        user.role = raw.role;
        user.status = raw.status;
        user.createdAt = raw.createdAt;
        user.updatedAt = raw.updatedAt;
        user.deletedAt = raw.deletedAt;
        return user;
    }
    static toPersistence(user) {
        let role = undefined;
        if (user.role) {
            role = new role_1.Role();
            role.id = user.role.id;
        }
        let photo = undefined;
        if (user.photo) {
            photo = new file_schema_1.FileSchemaClass();
            photo._id = user.photo.id;
            photo.path = user.photo.path;
        }
        let status = undefined;
        if (user.status) {
            status = new status_1.Status();
            status.id = user.status.id;
        }
        const userEntity = new user_schema_1.UserSchemaClass();
        if (user.id && typeof user.id === 'string') {
            userEntity._id = user.id;
        }
        userEntity.email = user.email;
        userEntity.password = user.password;
        userEntity.previousPassword = user.previousPassword;
        userEntity.provider = user.provider;
        userEntity.socialId = user.socialId;
        userEntity.firstName = user.firstName;
        userEntity.lastName = user.lastName;
        userEntity.photo = photo;
        userEntity.role = role;
        userEntity.status = status;
        userEntity.createdAt = user.createdAt;
        userEntity.updatedAt = user.updatedAt;
        userEntity.deletedAt = user.deletedAt;
        return userEntity;
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=user.mapper.js.map