import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import appConfig from "src/config/app.config";
import databaseConfig from "src/database/config/database.config";
import { DataSource, DataSourceOptions } from "typeorm";
import { TypeOrmConfigService } from "../../typeorm-config.service";
import { RoleSeedModule } from "./role/role-seed.module";
import { StatusSeedModule } from "./status/status-seed.module";
import { UserSeedModule } from "./user/user-seed.module";
import { FixedExpenseSeedModule } from "./fixed-expense/seedFixedExpense-seeds.module";
import { DigifranchiseServicerSeedModule } from "./digifranchise-service/digifranchise-service-offer-seed.module";
import { DigifranchiseProductSeedModule } from "./digifranchise-product/digifranchise-product-offer-seed.module";
import { ProfessionalBodySeedModule } from "./professional-body/professional-body-seed.module";

@Module({
  imports: [
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
    FixedExpenseSeedModule,
    DigifranchiseServicerSeedModule,
    DigifranchiseProductSeedModule,
    ProfessionalBodySeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
