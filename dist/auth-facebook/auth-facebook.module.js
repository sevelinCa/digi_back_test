"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFacebookModule = void 0;
const common_1 = require("@nestjs/common");
const auth_facebook_service_1 = require("./auth-facebook.service");
const config_1 = require("@nestjs/config");
const auth_facebook_controller_1 = require("./auth-facebook.controller");
const auth_module_1 = require("../auth/auth.module");
let AuthFacebookModule = class AuthFacebookModule {
};
exports.AuthFacebookModule = AuthFacebookModule;
exports.AuthFacebookModule = AuthFacebookModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, auth_module_1.AuthModule],
        providers: [auth_facebook_service_1.AuthFacebookService],
        exports: [auth_facebook_service_1.AuthFacebookService],
        controllers: [auth_facebook_controller_1.AuthFacebookController],
    })
], AuthFacebookModule);
//# sourceMappingURL=auth-facebook.module.js.map