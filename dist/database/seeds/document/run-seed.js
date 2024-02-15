"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const user_seed_service_1 = require("./user/user-seed.service");
const seed_module_1 = require("./seed.module");
const runSeed = async () => {
    const app = await core_1.NestFactory.create(seed_module_1.SeedModule);
    await app.get(user_seed_service_1.UserSeedService).run();
    await app.close();
};
void runSeed();
//# sourceMappingURL=run-seed.js.map