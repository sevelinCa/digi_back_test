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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSeedService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_2 = require("mongoose");
const roles_enum_1 = require("../../../../roles/roles.enum");
const statuses_enum_1 = require("../../../../statuses/statuses.enum");
const user_schema_1 = require("../../../../users/infrastructure/persistence/document/entities/user.schema");
let UserSeedService = class UserSeedService {
    constructor(model) {
        this.model = model;
    }
    async run() {
        const admin = await this.model.findOne({
            email: 'admin@example.com',
        });
        if (!admin) {
            const salt = await bcryptjs_1.default.genSalt();
            const password = await bcryptjs_1.default.hash('secret', salt);
            const data = new this.model({
                email: 'admin@example.com',
                password: password,
                firstName: 'Super',
                lastName: 'Admin',
                role: {
                    id: roles_enum_1.RoleEnum.admin,
                },
                status: {
                    id: statuses_enum_1.StatusEnum.active,
                },
            });
            await data.save();
        }
        const user = await this.model.findOne({
            email: 'john.doe@example.com',
        });
        if (!user) {
            const salt = await bcryptjs_1.default.genSalt();
            const password = await bcryptjs_1.default.hash('secret', salt);
            const data = new this.model({
                email: 'john.doe@example.com',
                password: password,
                firstName: 'John',
                lastName: 'Doe',
                role: {
                    id: roles_enum_1.RoleEnum.user,
                },
                status: {
                    id: statuses_enum_1.StatusEnum.active,
                },
            });
            await data.save();
        }
    }
};
exports.UserSeedService = UserSeedService;
exports.UserSeedService = UserSeedService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.UserSchemaClass.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserSeedService);
//# sourceMappingURL=user-seed.service.js.map