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
exports.AuthTwitterService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twitter_1 = __importDefault(require("twitter"));
let AuthTwitterService = class AuthTwitterService {
    constructor(configService) {
        this.configService = configService;
    }
    async getProfileByToken(loginDto) {
        const twitter = new twitter_1.default({
            consumer_key: this.configService.getOrThrow('twitter.consumerKey', {
                infer: true,
            }),
            consumer_secret: this.configService.getOrThrow('twitter.consumerSecret', {
                infer: true,
            }),
            access_token_key: loginDto.accessTokenKey,
            access_token_secret: loginDto.accessTokenSecret,
        });
        const data = await new Promise((resolve) => {
            twitter.get('account/verify_credentials', { include_email: true }, (error, profile) => {
                resolve(profile);
            });
        });
        return {
            id: data.id.toString(),
            email: data.email,
            firstName: data.name,
        };
    }
};
exports.AuthTwitterService = AuthTwitterService;
exports.AuthTwitterService = AuthTwitterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AuthTwitterService);
//# sourceMappingURL=auth-twitter.service.js.map