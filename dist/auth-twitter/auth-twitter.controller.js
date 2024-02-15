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
exports.AuthTwitterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../auth/auth.service");
const auth_twitter_service_1 = require("./auth-twitter.service");
const auth_twitter_login_dto_1 = require("./dto/auth-twitter-login.dto");
let AuthTwitterController = class AuthTwitterController {
    constructor(authService, authTwitterService) {
        this.authService = authService;
        this.authTwitterService = authTwitterService;
    }
    async login(loginDto) {
        const socialData = await this.authTwitterService.getProfileByToken(loginDto);
        return this.authService.validateSocialLogin('twitter', socialData);
    }
};
exports.AuthTwitterController = AuthTwitterController;
__decorate([
    (0, common_1.SerializeOptions)({
        groups: ['me'],
    }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_twitter_login_dto_1.AuthTwitterLoginDto]),
    __metadata("design:returntype", Promise)
], AuthTwitterController.prototype, "login", null);
exports.AuthTwitterController = AuthTwitterController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)({
        path: 'auth/twitter',
        version: '1',
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        auth_twitter_service_1.AuthTwitterService])
], AuthTwitterController);
//# sourceMappingURL=auth-twitter.controller.js.map