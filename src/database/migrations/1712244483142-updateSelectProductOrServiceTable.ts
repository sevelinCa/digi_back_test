import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSelectProductOrServiceTable1712244483142 implements MigrationInterface {
    name = 'UpdateSelectProductOrServiceTable1712244483142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_3243fae5e770172d23e876c057c"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_e232e52f79d56cb9ff9ed0dac00"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP COLUMN "digifranchiseServiceId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP COLUMN "ownerDigifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD "ownerDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD "digifranchiseService" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_e40d756cb6e557a2a269b01276e" FOREIGN KEY ("ownerDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_c80c8767cedc790c17243a5e57a" FOREIGN KEY ("digifranchiseService") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_c80c8767cedc790c17243a5e57a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_e40d756cb6e557a2a269b01276e"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP COLUMN "digifranchiseService"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP COLUMN "ownerDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD "ownerDigifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD "digifranchiseServiceId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_e232e52f79d56cb9ff9ed0dac00" FOREIGN KEY ("ownerDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_3243fae5e770172d23e876c057c" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
