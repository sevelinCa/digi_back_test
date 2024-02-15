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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const ms_1 = __importDefault(require("ms"));
const jwt_1 = require("@nestjs/jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const roles_enum_1 = require("../roles/roles.enum");
const statuses_enum_1 = require("../statuses/statuses.enum");
const auth_providers_enum_1 = require("./auth-providers.enum");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../users/users.service");
const session_service_1 = require("../session/session.service");
let AuthService = class AuthService {
    constructor(jwtService, usersService, sessionService, mailService, configService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
        this.sessionService = sessionService;
        this.mailService = mailService;
        this.configService = configService;
    }
    async validateLogin(loginDto) {
        const user = await this.usersService.findOne({
            email: loginDto.email,
        });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: 'notFound',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (user.provider !== auth_providers_enum_1.AuthProvidersEnum.email) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: `needLoginViaProvider:${user.provider}`,
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        if (!user.password) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    password: 'incorrectPassword',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const isValidPassword = await bcryptjs_1.default.compare(loginDto.password, user.password);
        if (!isValidPassword) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    password: 'incorrectPassword',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const session = await this.sessionService.create({
            user,
        });
        const { token, refreshToken, tokenExpires } = await this.getTokensData({
            id: user.id,
            role: user.role,
            sessionId: session.id,
        });
        return {
            refreshToken,
            token,
            tokenExpires,
            user,
        };
    }
    async validateSocialLogin(authProvider, socialData) {
        let user = null;
        const socialEmail = socialData.email?.toLowerCase();
        let userByEmail = null;
        if (socialEmail) {
            userByEmail = await this.usersService.findOne({
                email: socialEmail,
            });
        }
        if (socialData.id) {
            user = await this.usersService.findOne({
                socialId: socialData.id,
                provider: authProvider,
            });
        }
        if (user) {
            if (socialEmail && !userByEmail) {
                user.email = socialEmail;
            }
            await this.usersService.update(user.id, user);
        }
        else if (userByEmail) {
            user = userByEmail;
        }
        else {
            const role = {
                id: roles_enum_1.RoleEnum.user,
            };
            const status = {
                id: statuses_enum_1.StatusEnum.active,
            };
            user = await this.usersService.create({
                email: socialEmail ?? null,
                firstName: socialData.firstName ?? null,
                lastName: socialData.lastName ?? null,
                socialId: socialData.id,
                provider: authProvider,
                role,
                status,
            });
            user = await this.usersService.findOne({
                id: user?.id,
            });
        }
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    user: 'userNotFound',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const session = await this.sessionService.create({
            user,
        });
        const { token: jwtToken, refreshToken, tokenExpires, } = await this.getTokensData({
            id: user.id,
            role: user.role,
            sessionId: session.id,
        });
        return {
            refreshToken,
            token: jwtToken,
            tokenExpires,
            user,
        };
    }
    async register(dto) {
        const user = await this.usersService.create({
            ...dto,
            email: dto.email,
            role: {
                id: roles_enum_1.RoleEnum.user,
            },
            status: {
                id: statuses_enum_1.StatusEnum.inactive,
            },
        });
        const hash = await this.jwtService.signAsync({
            confirmEmailUserId: user.id,
        }, {
            secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
                infer: true,
            }),
            expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
                infer: true,
            }),
        });
    }
    async confirmEmail(hash) {
        let userId;
        try {
            const jwtData = await this.jwtService.verifyAsync(hash, {
                secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
                    infer: true,
                }),
            });
            userId = jwtData.confirmEmailUserId;
        }
        catch {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `invalidHash`,
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const user = await this.usersService.findOne({
            id: userId,
        });
        if (!user || user?.status?.id !== statuses_enum_1.StatusEnum.inactive) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.NOT_FOUND,
                error: `notFound`,
            }, common_1.HttpStatus.NOT_FOUND);
        }
        user.status = {
            id: statuses_enum_1.StatusEnum.active,
        };
        await this.usersService.update(user.id, user);
    }
    async forgotPassword(email) {
        const user = await this.usersService.findOne({
            email,
        });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    email: 'emailNotExists',
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const hash = await this.jwtService.signAsync({
            forgotUserId: user.id,
        }, {
            secret: this.configService.getOrThrow('auth.forgotSecret', {
                infer: true,
            }),
            expiresIn: this.configService.getOrThrow('auth.forgotExpires', {
                infer: true,
            }),
        });
        await this.mailService.forgotPassword({
            to: email,
            data: {
                hash,
            },
        });
    }
    async resetPassword(hash, password) {
        let userId;
        try {
            const jwtData = await this.jwtService.verifyAsync(hash, {
                secret: this.configService.getOrThrow('auth.forgotSecret', {
                    infer: true,
                }),
            });
            userId = jwtData.forgotUserId;
        }
        catch {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `invalidHash`,
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        const user = await this.usersService.findOne({
            id: userId,
        });
        if (!user) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                errors: {
                    hash: `notFound`,
                },
            }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        }
        user.password = password;
        await this.sessionService.softDelete({
            user: {
                id: user.id,
            },
        });
        await this.usersService.update(user.id, user);
    }
    async me(userJwtPayload) {
        return this.usersService.findOne({
            id: userJwtPayload.id,
        });
    }
    async update(userJwtPayload, userDto) {
        if (userDto.password) {
            if (!userDto.oldPassword) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        oldPassword: 'missingOldPassword',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const currentUser = await this.usersService.findOne({
                id: userJwtPayload.id,
            });
            if (!currentUser) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        user: 'userNotFound',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            if (!currentUser.password) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        oldPassword: 'incorrectOldPassword',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            const isValidOldPassword = await bcryptjs_1.default.compare(userDto.oldPassword, currentUser.password);
            if (!isValidOldPassword) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                        oldPassword: 'incorrectOldPassword',
                    },
                }, common_1.HttpStatus.UNPROCESSABLE_ENTITY);
            }
            else {
                await this.sessionService.softDelete({
                    user: {
                        id: currentUser.id,
                    },
                    excludeId: userJwtPayload.sessionId,
                });
            }
        }
        await this.usersService.update(userJwtPayload.id, userDto);
        return this.usersService.findOne({
            id: userJwtPayload.id,
        });
    }
    async refreshToken(data) {
        const session = await this.sessionService.findOne({
            id: data.sessionId,
        });
        if (!session) {
            throw new common_1.UnauthorizedException();
        }
        const { token, refreshToken, tokenExpires } = await this.getTokensData({
            id: session.user.id,
            role: session.user.role,
            sessionId: session.id,
        });
        return {
            token,
            refreshToken,
            tokenExpires,
        };
    }
    async softDelete(user) {
        await this.usersService.softDelete(user.id);
    }
    async logout(data) {
        return this.sessionService.softDelete({
            id: data.sessionId,
        });
    }
    async getTokensData(data) {
        const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
            infer: true,
        });
        const tokenExpires = Date.now() + (0, ms_1.default)(tokenExpiresIn);
        const [token, refreshToken] = await Promise.all([
            await this.jwtService.signAsync({
                id: data.id,
                role: data.role,
                sessionId: data.sessionId,
            }, {
                secret: this.configService.getOrThrow('auth.secret', { infer: true }),
                expiresIn: tokenExpiresIn,
            }),
            await this.jwtService.signAsync({
                sessionId: data.sessionId,
            }, {
                secret: this.configService.getOrThrow('auth.refreshSecret', {
                    infer: true,
                }),
                expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
                    infer: true,
                }),
            }),
        ]);
        return {
            token,
            refreshToken,
            tokenExpires,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService,
        session_service_1.SessionService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map