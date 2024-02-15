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
exports.SessionDocumentRepository = void 0;
const common_1 = require("@nestjs/common");
const session_schema_1 = require("../entities/session.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const session_mapper_1 = require("../mappers/session.mapper");
let SessionDocumentRepository = class SessionDocumentRepository {
    constructor(sessionModel) {
        this.sessionModel = sessionModel;
    }
    async findOne(fields) {
        if (fields.id) {
            const sessionObject = await this.sessionModel.findById(fields.id);
            return sessionObject ? session_mapper_1.SessionMapper.toDomain(sessionObject) : null;
        }
        const sessionObject = await this.sessionModel.findOne(fields);
        return sessionObject ? session_mapper_1.SessionMapper.toDomain(sessionObject) : null;
    }
    async create(data) {
        const persistenceModel = session_mapper_1.SessionMapper.toPersistence(data);
        const createdSession = new this.sessionModel(persistenceModel);
        const sessionObject = await createdSession.save();
        return session_mapper_1.SessionMapper.toDomain(sessionObject);
    }
    async softDelete({ excludeId, ...criteria }) {
        const transformedCriteria = {
            user: criteria.user?.id,
            _id: criteria.id
                ? criteria.id
                : excludeId
                    ? { $not: { $eq: excludeId } }
                    : undefined,
        };
        await this.sessionModel.deleteMany(transformedCriteria);
    }
};
exports.SessionDocumentRepository = SessionDocumentRepository;
exports.SessionDocumentRepository = SessionDocumentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(session_schema_1.SessionSchemaClass.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SessionDocumentRepository);
//# sourceMappingURL=session.repository.js.map