"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersDocumentRepository = void 0;
const common_1 = require("@nestjs/common");
const user_schema_1 = require("../entities/user.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_mapper_1 = require("../mappers/user.mapper");
let UsersDocumentRepository = class UsersDocumentRepository {
    constructor(usersModel) {
        this.usersModel = usersModel;
    }
    async create(data) {
        const persistenceModel = user_mapper_1.UserMapper.toPersistence(data);
        const createdUser = new this.usersModel(persistenceModel);
        const userObject = await createdUser.save();
        return user_mapper_1.UserMapper.toDomain(userObject);
    }
    async findManyWithPagination({ filterOptions, sortOptions, paginationOptions, }) {
        const where = {};
        if (filterOptions?.roles?.length) {
            where['role.id'] = {
                $in: filterOptions.roles.map((role) => role.id),
            };
        }
        const userObjects = await this.usersModel
            .find(where)
            .sort(sortOptions?.reduce((accumulator, sort) => ({
            ...accumulator,
            [sort.orderBy === 'id' ? '_id' : sort.orderBy]: sort.order.toUpperCase() === 'ASC' ? 1 : -1,
        }), {}))
            .skip((paginationOptions.page - 1) * paginationOptions.limit)
            .limit(paginationOptions.limit);
        return userObjects.map((userObject) => user_mapper_1.UserMapper.toDomain(userObject));
    }
    async findOne(fields) {
        if (fields.id) {
            const userObject = await this.usersModel.findById(fields.id);
            return userObject ? user_mapper_1.UserMapper.toDomain(userObject) : null;
        }
        const userObject = await this.usersModel.findOne(fields);
        return userObject ? user_mapper_1.UserMapper.toDomain(userObject) : null;
    }
    async update(id, payload) {
        const clonedPayload = { ...payload };
        delete clonedPayload.id;
        const filter = { _id: id };
        const userObject = await this.usersModel.findOneAndUpdate(filter, clonedPayload);
        return userObject ? user_mapper_1.UserMapper.toDomain(userObject) : null;
    }
    async softDelete(id) {
        await this.usersModel.deleteOne({
            _id: id,
        });
    }
};
exports.UsersDocumentRepository = UsersDocumentRepository;
exports.UsersDocumentRepository = UsersDocumentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserSchemaClass.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersDocumentRepository);
//# sourceMappingURL=user.repository.js.map