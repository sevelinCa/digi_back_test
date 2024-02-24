import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get('database.type', { infer: true }),
      url: this.configService.get('database.url', { infer: true }),
      // host: this.configService.get('database.host', { infer: true }),
      // port: this.configService.get('database.port', { infer: true }),
      // username: this.configService.get('database.username', { infer: true }),
      // password: this.configService.get('database.password', { infer: true }),
      // database: this.configService.get('database.name', { infer: true }),
      synchronize: this.configService.get('database.synchronize', {
        infer: true,
      }),
      dropSchema: false,
      keepConnectionAlive: true,
      logging:
        this.configService.get('app.nodeEnv', { infer: true }) !== 'production',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      cli: {
        entitiesDir: 'src',
        migrationsDir: 'src/database/migrations',
        subscribersDir: 'subscriber',
      },
      extra: {
        // based on https://node-postgres.com/apis/pool
        // max connection pool size
        max: this.configService.get('database.maxConnections', { infer: true }),
        ssl: this.configService.get('database.sslEnabled', { infer: true })
          ? {
              rejectUnauthorized: false,
              ca: `-----BEGIN CERTIFICATE-----
              MIIEQTCCAqmgAwIBAgIUQXcZBuPdU18ClmJ+U2Ho0EpzzO8wDQYJKoZIhvcNAQEM
              BQAwOjE4MDYGA1UEAwwvMDgzYTdlMmEtMGQ3My00MGNlLTg0YmEtMDhkOGM2YTAz
              NzJlIFByb2plY3QgQ0EwHhcNMjIwOTA3MTQwNDEzWhcNMzIwOTA0MTQwNDEzWjA6
              MTgwNgYDVQQDDC8wODNhN2UyYS0wZDczLTQwY2UtODRiYS0wOGQ4YzZhMDM3MmUg
              UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAKSdz19L
              g1VqBMNC/RzidBnhIXtN5pBBqVaKLoHPGmJCwonMmYfbhGyIqTmo+f/kMhjEjDr4
              UZjmhxlchq4sQ0hgHdrCfw/kKz8sls6M0aAnZja3MP4KV941vPldVqS5Ba0YyWFQ
              NMRmRgAFjjK3XBli8BFNI8WF8C21iWrKgehVwIJegoXf010CIKI98mPyCCoJWh9z
              yIJpbBZH7qUMxXZE5mIqHj54eUqFklXB92dvevgLt9iIPIi16g0EDW4o5sdTXywG
              IB02EiWnvrCFVxAayw5FoPpcfJbW8ufPJjAF0WD2IRkZW4FlqR/bqBoGwwbu0V0r
              iZ2OQ7EcFkkoeuYEN+JWfQIjEHdSUUWfKyP4UaYMnqtej/VL0eRyBTFDFMaTlnTu
              eWYvwJ+AThCcFNPU3+gJTGBaUTbLoKuzoewZ7qjLxPkwW67I1RsyFgDWrzqf/GM5
              MqHWuEZP/cbNEVyhLQW+UgEeSIKbspSjeabgPjlg9lby6PZTl49F3mlYhwIDAQAB
              oz8wPTAdBgNVHQ4EFgQU5RuLpmxI5f/p+DIjADxlU302BUYwDwYDVR0TBAgwBgEB
              /wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAEkUzwpWdJvJbmKw
              t2n6W+hMGhnlGZgg2kCSN+Ey50MhPNEV3DvcMXDszYCsfBEbH+tlVyGV7wOm52HY
              dMpjaUYRUaACGhsp25LNzbHqyNPj6HNTSqtB0eeUR4Q+qmQ65a+lVIFZcvIrf74d
              iBQatnBq3h/qAvk1xyy2kVDpWZalBHc16bdvz9wYjnKH/uLYgOTJvY8t+38a7vZ6
              eMCwWm5VxFsRN76j8cWspcioFz3APS+0MVY9IiFvuzBaE/ciELfSkdfybdXuSD00
              FLdSZeBH7yE2biDkfJSXc2zt7EhRRlyk4A01W3QdsbnDaX8pKFVruuWxwJxEvQUq
              A5XVzpairjv0Nik3C0Pb1W2Ru4sses40kHQz4S17NBW1VXRzS7J/mfneSC8unSBQ
              hpGaAeVUTZi6v/Zyer5CcTm9xnL/feRdXPoqO2CRsbMdSBbBOOEAzEWo9+MKxihQ
              UQGGiLO+hApZMMjhQSWy4nzniAs7S0IhnSEYK16ACdimCJJ6nw==
              -----END CERTIFICATE-----`
            }
          : undefined,
      },
    } as TypeOrmModuleOptions;
  }
}
