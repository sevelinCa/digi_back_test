import { MigrationInterface, QueryRunner } from "typeorm";

export class SuppliersManagmentTables1710129190002
  implements MigrationInterface
{
  name = "SuppliersManagmentTables1710129190002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "supplier_management" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullNames" text NOT NULL, "email" character varying NOT NULL, "mobile_number" character varying NOT NULL, "supplier_type" character varying NOT NULL, "company_registration_number" character varying, "vat_number" character varying, "address" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_10f8e6846ede50b63f2fb758d22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ADD "fullNames" text`,
    );
    await queryRunner.query(
      `UPDATE "customer_management" SET "fullNames" = 'Default Value' WHERE "fullNames" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ALTER COLUMN "fullNames" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_3fb9db823129e304bfbfb410330" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_8b51f0a80c89d1dc7748a756c1d" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_8b51f0a80c89d1dc7748a756c1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_3fb9db823129e304bfbfb410330"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" DROP COLUMN "fullNames"`,
    );
    await queryRunner.query(`DROP TABLE "supplier_management"`);
  }
}
