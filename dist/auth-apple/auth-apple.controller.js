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
exports.AuthAppleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../auth/auth.service");
const auth_apple_service_1 = require("./auth-apple.service");
const auth_apple_login_dto_1 = require("./dto/auth-apple-login.dto");
let AuthAppleController = class AuthAppleController {
    constructor(authService, authAppleService) {
        this.authService = authService;
        this.authAppleService = authAppleService;
    }
    async login(loginDto) {
        const socialData = await this.authAppleService.getProfileByToken(loginDto);
        return this.authService.validateSocialLogin('apple', socialData);
    }
};
exports.AuthAppleController = AuthAppleController;
__decorate([
    (0, common_1.SerializeOptions)({
        groups: ['me'],
    }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_apple_login_dto_1.AuthAppleLoginDto]),
    __metadata("design:returntype", Promise)
], AuthAppleController.prototype, "login", null);
exports.AuthAppleController = AuthAppleController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)({
        path: 'auth/apple',
        version: '1',
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        auth_apple_service_1.AuthAppleService])
], AuthAppleController);
//# sourceMappingURL=auth-apple.controller.js.map