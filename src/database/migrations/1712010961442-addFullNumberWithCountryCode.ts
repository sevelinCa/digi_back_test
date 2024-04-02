import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFullNumberWithCountryCode1712010961442 implements MigrationInterface {
    name = 'AddFullNumberWithCountryCode1712010961442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD "connectNumberWithOutCountryCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD "otherMobileNumberWithOutCountryCode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP COLUMN "otherMobileNumberWithOutCountryCode"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP COLUMN "connectNumberWithOutCountryCode"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
