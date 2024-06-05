import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUniqueConnectNumber1717591737952 implements MigrationInterface {
    name = 'MakeUniqueConnectNumber1717591737952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "connectNumberWithOutCountryCode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "UQ_791ad8fe94567310124d099b086" UNIQUE ("connectNumberWithOutCountryCode")`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "connectNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "UQ_d505670aeddb104b51c1cb30d6d" UNIQUE ("connectNumber")`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "otherMobileNumberWithOutCountryCode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "UQ_9d85386018231feb970e69a9c0c" UNIQUE ("otherMobileNumberWithOutCountryCode")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "UQ_9d85386018231feb970e69a9c0c"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "otherMobileNumberWithOutCountryCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "UQ_d505670aeddb104b51c1cb30d6d"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "connectNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "UQ_791ad8fe94567310124d099b086"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ALTER COLUMN "connectNumberWithOutCountryCode" SET NOT NULL`);
    }

}
