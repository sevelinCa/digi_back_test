import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageColumnInProductAndService1711475691459 implements MigrationInterface {
    name = 'AddImageColumnInProductAndService1711475691459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_ff2a3f51ce0717048e6ef290076"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_a44312fae83ef09e59763e246d1"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_select_product_or_service_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSelected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownerDigifranchiseId" uuid, "digifranchiseServiceId" uuid, "userId" uuid, CONSTRAINT "PK_b6c83ba81cb8647be16b2ccacfd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP COLUMN "serviceId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD "digifranchiseServiceId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD "digifranchiseProductId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_b421043cbc4ef6382596af55390" FOREIGN KEY ("digifranchiseProductId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_e232e52f79d56cb9ff9ed0dac00" FOREIGN KEY ("ownerDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_3243fae5e770172d23e876c057c" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_d8bcabd27efae3b578e215182ee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_d8bcabd27efae3b578e215182ee"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_3243fae5e770172d23e876c057c"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_e232e52f79d56cb9ff9ed0dac00"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_b421043cbc4ef6382596af55390"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP COLUMN "digifranchiseProductId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP COLUMN "digifranchiseServiceId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD "serviceId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD "productId" uuid`);
        await queryRunner.query(`DROP TABLE "digifranchise_select_product_or_service_table"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_a44312fae83ef09e59763e246d1" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_owned_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_ff2a3f51ce0717048e6ef290076" FOREIGN KEY ("productId") REFERENCES "digifranchise_owned_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
