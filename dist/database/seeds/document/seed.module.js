"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_config_1 = __importDefault(require("../../../config/app.config"));
const database_config_1 = __importDefault(require("../../config/database.config"));
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_config_service_1 = require("../../mongoose-config.service");
const user_seed_module_1 = require("./user/user-seed.module");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            user_seed_module_1.UserSeedModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, app_config_1.default],
                envFilePath: ['.env'],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useClass: mongoose_config_service_1.MongooseConfigService,
            }),
        ],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map