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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./infrastructure/persistence/user.repository");
const statuses_enum_1 = require("../statuses/statuses.enum");
const roles_enum_1 = require("../roles/roles.enum");
const files_service_1 = require("../files/files.service");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_providers_enum_1 = require("../auth/auth-providers.enum");
let UsersService = class UsersService {
    constructor(usersRepository, filesService) {
        this.usersRepository = usersRepository;
        this.filesService = filesService;
    }
    async create(createProfileDto) {
        const clonedPayload = {
            provider: auth_providers_enum_1.AuthProvidersEnum.email,
            ...createProfileDto,
        };
        if (clonedPayload.password) {
            const salt = await bcryptjs_1.default.genSalt();
            clonedPayload.password = await bcryptjs_1.default.hash(clonedPayload.password, salt);
        }
        if (clonedPayload.email) {
            const userObject = await this.usersRepository.findOne({
                email: clonedPayload.email,
            });
            if (userObject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        email: 'emailAlreadyExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        if (clonedPayload.photo?.id) {
            const fileObject = await this.filesService.findOne({
                id: clonedPayload.photo.id,
            });
            if (!fileObject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        photo: 'imageNotExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            clonedPayload.photo = fileObject;
        }
        if (clonedPayload.role?.id) {
            const roleObject = Object.values(roles_enum_1.RoleEnum).includes(clonedPayload.role.id);
            if (!roleObject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        role: 'roleNotExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        if (clonedPayload.status?.id) {
            const statusObject = Object.values(statuses_enum_1.StatusEnum).includes(clonedPayload.status.id);
            if (!statusObject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        status: 'statusNotExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        return this.usersRepository.create(clonedPayload);
    }
    findManyWithPagination({ filterOptions, sortOptions, paginationOptions, }) {
        return this.usersRepository.findManyWithPagination({
            filterOptions,
            sortOptions,
            paginationOptions,
        });
    }
    findOne(fields) {
        return this.usersRepository.findOne(fields);
    }
    async update(id, payload) {
        const clonedPayload = { ...payload };
        if (clonedPayload.password &&
            clonedPayload.previousPassword !== clonedPayload.password) {
            const salt = await bcryptjs_1.default.genSalt();
            clonedPayload.password = await bcryptjs_1.default.hash(clonedPayload.password, salt);
        }
        if (clonedPayload.email) {
            const userObject = await this.usersRepository.findOne({
                email: clonedPayload.email,
            });
            if (userObject?.id !== id) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        email: 'emailAlreadyExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        if (clonedPayload.photo?.id) {
            const fileObject = await this.filesService.findOne({
                id: clonedPayload.photo.id,
            });
            if (!fileObject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        photo: 'imageNotExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            clonedPayload.photo = fileObject;
        }
        if (clonedPayload.role?.id) {
            const roleObject = Object.values(roles_enum_1.RoleEnum).includes(clonedPayload.role.id);
            if (!roleObject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        role: 'roleNotExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        if (clonedPayload.status?.id) {
            const statusObject = Object.values(statuses_enum_1.StatusEnum).includes(clonedPayload.status.id);
            if (!statusObject) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        status: 'statusNotExists',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
        }
        return this.usersRepository.update(id, clonedPayload);
    }
    async softDelete(id) {
        await this.usersRepository.softDelete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        files_service_1.FilesService])
], UsersService);
//# sourceMappingURL=users.service.js.map