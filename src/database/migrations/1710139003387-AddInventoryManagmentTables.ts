import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInventoryManagmentTables1710139003387 implements MigrationInterface {
    name = 'AddInventoryManagmentTables1710139003387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "staff_management" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullNames" text NOT NULL, "email" text NOT NULL, "mobile_number" text NOT NULL, "id_or_passport_number" text NOT NULL, "date_of_birth" TIMESTAMP NOT NULL DEFAULT now(), "role_description" text NOT NULL, "address" text NOT NULL, "date_started" TIMESTAMP NOT NULL DEFAULT now(), "app_access" boolean NOT NULL, "registration_method" text NOT NULL, "tax_number" text NOT NULL, "uif_number" text NOT NULL, "gross_monthly_salary" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_929d7f1350ca2762a37653495b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_management" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "description" text NOT NULL, "quantity" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseId" uuid, CONSTRAINT "PK_21865e7b0de8e2bd9f26f24539e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "staff_management" ADD CONSTRAINT "FK_cdeb26c1e7f66aeda069b76e967" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "staff_management" ADD CONSTRAINT "FK_673b98e05518934b48132f98088" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_533b0a815c8195e11ace856ae16" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_12b6333a4399ebdbfe816e74f51" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_12b6333a4399ebdbfe816e74f51"`);
        await queryRunner.query(`ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_533b0a815c8195e11ace856ae16"`);
        await queryRunner.query(`ALTER TABLE "staff_management" DROP CONSTRAINT "FK_673b98e05518934b48132f98088"`);
        await queryRunner.query(`ALTER TABLE "staff_management" DROP CONSTRAINT "FK_cdeb26c1e7f66aeda069b76e967"`);
        await queryRunner.query(`DROP TABLE "inventory_management"`);
        await queryRunner.query(`DROP TABLE "staff_management"`);
    }

}
