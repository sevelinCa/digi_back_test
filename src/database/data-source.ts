import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

export const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  url: process.env.DATABASE_URL,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? parseInt(process.env.DATABASE_PORT, 10)
    : 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === "true",
  dropSchema: false,
  keepConnectionAlive: true,
  logging: process.env.NODE_ENV !== "production",
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  cli: {
    entitiesDir: "src",
    migrationsDir: "src/database/migrations",
    subscribersDir: "subscriber",
  },
  extra: {
    // based on https://node-postgres.com/api/pool
    // max connection pool size
    max: process.env.DATABASE_MAX_CONNECTIONS
      ? parseInt(process.env.DATABASE_MAX_CONNECTIONS, 10)
      : 100,
    ssl:
      process.env.DATABASE_SSL_ENABLED === "true"
        ? {
            rejectUnauthorized: false,
            ca: process.env.DATABASE_CA,
          }
        : undefined,
  },
} as DataSourceOptions);
