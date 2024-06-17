import { NestFactory } from "@nestjs/core";
import { RoleSeedService } from "./role/role-seed.service";
import { SeedModule } from "./seed.module";
import { StatusSeedService } from "./status/status-seed.service";
import { UserSeedService } from "./user/user-seed.service";
import { FixedExpenseSeedService } from "./fixed-expense/seedFixedExpense-seeds.service";
import { DigifranchiseServiceSeedService } from "./digifranchise-service/digifranchise-service-seed.service";
import { DigifranchiseProductSeedService } from "./digifranchise-product/digifranchise-product-seed.service";
import { ProfessionalBodySeedService } from "./professional-body/professional-body-seed.service";
import { OrderSeedService } from "./order/order-seeds.service";

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(FixedExpenseSeedService).run();
  await app.get(DigifranchiseServiceSeedService).run();
  await app.get(DigifranchiseProductSeedService).run();
  await app.get(ProfessionalBodySeedService).run();
  await app.get(OrderSeedService).run();

  await app.close();
};

void runSeed();
