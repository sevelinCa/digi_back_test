import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module";
// import { FilesModule } from './files/files.module';
import { AuthModule } from "./auth/auth.module";
import databaseConfig from "./database/config/database.config";
import authConfig from "./auth/config/auth.config";
import appConfig from "./config/app.config";
import mailConfig from "./mail/config/mail.config";
// import fileConfig from './files/config/file.config';
// import facebookConfig from './auth-facebook/config/facebook.config';
// import googleConfig from './auth-google/config/google.config';
// import twitterConfig from './auth-twitter/config/twitter.config';
// import appleConfig from './auth-apple/config/apple.config';
import path from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { AuthAppleModule } from './auth-apple/auth-apple.module';
// import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
// import { AuthGoogleModule } from './auth-google/auth-google.module';
// import { AuthTwitterModule } from './auth-twitter/auth-twitter.module';
// import { I18nModule } from 'nestjs-i18n/dist/i18n.module';
import { HeaderResolver, I18nModule } from "nestjs-i18n";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import { MailModule } from "./mail/mail.module";
import { HomeModule } from "./home/home.module";
import { DataSource, DataSourceOptions } from "typeorm";
import { AllConfigType } from "./config/config.type";
import { SessionModule } from "./session/session.module";
import { MailerModule } from "./mailer/mailer.module";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseConfig } from "./database/config/database-config.type";
// import { AccountingModule } from './accounting/accounting.module';
// import { AssetMgtModule } from './asset-mgt/asset-mgt.module';
import { DigifranchiseModule } from "./digifranchise/digifranchise.module";
// import { InventoryModule } from './inventory/inventory.module';
// import { AssetMgtModule } from './asset-mgt/asset-mgt.module';
import { SmsModule } from "./sms/sms.module";
import { UserModule } from "./user/user.module";
import { ProfessionalBodiesModule } from "./professional-bodies/professional-bodies.module";
import { CalenderMgtModule } from "./calender-mgt/calender-mgt.module";
import { FilesModule } from "./files/files.module";
import { DigifranchiseMgtModule } from "./digifranchise-mgt/digifranchise-mgt.module";
import { DigifranchiseSubscriptionModule } from "./digifranchise-subscription/digifranchise-subscription.module";
import { DigifranchisePaymentModule } from "./payment/digifranchise-payment.module";
// import { ChatModule } from './chat/chat.module';
import { EnquiryMessageModule } from "./enquiry-message/enquiry-message.module";
import { RatingOrderModule } from "./rating/rating-order.module";
import { AccountingModule } from "./accounting/accounting.module";
import { AssetMgtModule } from "./asset-mgt/asset-mgt.module";
import { InventoryModule } from "./inventory/inventory.module";
import { CalendarModule } from "./calendar/calendar.module";
import { DigifranchiseAcademyModule } from "./digifranchise-academy/digifranchise-academy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        // fileConfig,
        // facebookConfig,
        // googleConfig,
        // twitterConfig,
        // appleConfig,
      ],
      envFilePath: [".env"],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),

    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => {
        const i18nPath = path.join(__dirname, "../i18n/");

        const fallbackLanguage = configService.getOrThrow(
          "app.fallbackLanguage",
          {
            infer: true,
          },
        );

        const loaderOptions = {
          path: i18nPath,
          watch: true,
        };

        return {
          fallbackLanguage,
          loaderOptions,
        };
      },
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get("app.headerLanguage", {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),

    UsersModule,
    // FilesModule,
    AuthModule,
    // AuthFacebookModule,
    // AuthGoogleModule,
    // AuthTwitterModule,
    // AuthAppleModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    AccountingModule,
    DigifranchiseModule,
    InventoryModule,
    AssetMgtModule,
    SmsModule,
    UserModule,
    ProfessionalBodiesModule,
    CalenderMgtModule,
    FilesModule,
    DigifranchiseMgtModule,
    DigifranchiseSubscriptionModule,
    DigifranchisePaymentModule,
    EnquiryMessageModule,
    RatingOrderModule,
    CalendarModule,
    DigifranchiseAcademyModule,
    // ChatModule
  ],
})
export class AppModule {}
