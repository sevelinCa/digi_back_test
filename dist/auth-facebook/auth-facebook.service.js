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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFacebookService = void 0;
const common_1 = require("@nestjs/common");
const fb_1 = require("fb");
const config_1 = require("@nestjs/config");
let AuthFacebookService = class AuthFacebookService {
    constructor(configService) {
        this.configService = configService;
    }
    async getProfileByToken(loginDto) {
        const fb = new fb_1.Facebook({
            appId: this.configService.get('facebook.appId', {
                infer: true,
            }),
            appSecret: this.configService.get('facebook.appSecret', {
                infer: true,
            }),
            version: 'v7.0',
        });
        fb.setAccessToken(loginDto.accessToken);
        const data = await new Promise((resolve) => {
            fb.api('/me', 'get', { fields: 'id,last_name,email,first_name' }, (response) => {
                resolve(response);
            });
        });
        return {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
        };
    }
};
exports.AuthFacebookService = AuthFacebookService;
exports.AuthFacebookService = AuthFacebookService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthFacebookService);
//# sourceMappingURL=auth-facebook.service.js.map