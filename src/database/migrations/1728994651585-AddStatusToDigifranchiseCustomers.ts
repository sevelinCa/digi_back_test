import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToDigifranchiseCustomers1728994651585 implements MigrationInterface {
    name = 'AddStatusToDigifranchiseCustomers1728994651585'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" ADD "statusId" integer`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" ADD CONSTRAINT "FK_c5b27232552d1a48196ff43f79f" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" DROP CONSTRAINT "FK_c5b27232552d1a48196ff43f79f"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_customers" DROP COLUMN "statusId"`);
    }

}
