import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdIntoDigifranchiseServiceOfferedTable1708990148345 implements MigrationInterface {
    name = 'AddUserIdIntoDigifranchiseServiceOfferedTable1708990148345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_c4729ec60a40846cd2c5415828a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_c4729ec60a40846cd2c5415828a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP COLUMN "userId"`);
    }

}
