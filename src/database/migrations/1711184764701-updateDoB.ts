import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDoB1711184764701 implements MigrationInterface {
    name = 'UpdateDoB1711184764701'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" DROP COLUMN "productPublished"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP COLUMN "servicePublished"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "UQ_d505670aeddb104b51c1cb30d6d"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "UQ_cc231c1aa6e323af9710a94ea17"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "UQ_cc231c1aa6e323af9710a94ea17" UNIQUE ("otherMobileNumber")`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "UQ_d505670aeddb104b51c1cb30d6d" UNIQUE ("connectNumber")`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD "servicePublished" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" ADD "productPublished" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
