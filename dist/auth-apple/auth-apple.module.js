"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAppleModule = void 0;
const common_1 = require("@nestjs/common");
const auth_apple_service_1 = require("./auth-apple.service");
const config_1 = require("@nestjs/config");
const auth_apple_controller_1 = require("./auth-apple.controller");
const auth_module_1 = require("../auth/auth.module");
let AuthAppleModule = class AuthAppleModule {
};
exports.AuthAppleModule = AuthAppleModule;
exports.AuthAppleModule = AuthAppleModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, auth_module_1.AuthModule],
        providers: [auth_apple_service_1.AuthAppleService],
        exports: [auth_apple_service_1.AuthAppleService],
        controllers: [auth_apple_controller_1.AuthAppleController],
    })
], AuthAppleModule);
//# sourceMappingURL=auth-apple.module.js.map