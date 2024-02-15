"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const role_entity_1 = require("../../../../../roles/infrastructure/persistence/relational/entities/role.entity");
const user_1 = require("../../../../domain/user");
const user_entity_1 = require("../entities/user.entity");
const file_entity_1 = require("../../../../../files/infrastructure/persistence/relational/entities/file.entity");
const status_entity_1 = require("../../../../../statuses/infrastructure/persistence/relational/entities/status.entity");
const file_mapper_1 = require("../../../../../files/infrastructure/persistence/relational/mappers/file.mapper");
class UserMapper {
    static toDomain(raw) {
        const user = new user_1.User();
        user.id = raw.id;
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
            role = new role_entity_1.RoleEntity();
            role.id = user.role.id;
        }
        let photo = undefined;
        if (user.photo) {
            photo = new file_entity_1.FileEntity();
            photo.id = user.photo.id;
        }
        let status = undefined;
        if (user.status) {
            status = new status_entity_1.StatusEntity();
            status.id = user.status.id;
        }
        const userEntity = new user_entity_1.UserEntity();
        if (user.id && typeof user.id === 'number') {
            userEntity.id = user.id;
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