"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTwitterModule = void 0;
const common_1 = require("@nestjs/common");
const auth_twitter_service_1 = require("./auth-twitter.service");
const config_1 = require("@nestjs/config");
const auth_twitter_controller_1 = require("./auth-twitter.controller");
const auth_module_1 = require("../auth/auth.module");
let AuthTwitterModule = class AuthTwitterModule {
};
exports.AuthTwitterModule = AuthTwitterModule;
exports.AuthTwitterModule = AuthTwitterModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, auth_module_1.AuthModule],
        providers: [auth_twitter_service_1.AuthTwitterService],
        exports: [auth_twitter_service_1.AuthTwitterService],
        controllers: [auth_twitter_controller_1.AuthTwitterController],
    })
], AuthTwitterModule);
//# sourceMappingURL=auth-twitter.module.js.map