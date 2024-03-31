import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatingImageTableWithSubServiceAndProductIds1711878911568 implements MigrationInterface {
    name = 'UpdatingImageTableWithSubServiceAndProductIds1711878911568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_sub_service_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceCategoryName" character varying(255) NOT NULL, "unitPrice" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "subServiceId" uuid, CONSTRAINT "PK_452b4401dc0cbc16524e5c1db24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD "subServiceId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD "subProductId" uuid`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD "subProduct" uuid`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD "subService" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_service_category" ADD CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f" FOREIGN KEY ("subProductId") REFERENCES "digifranchise_sub_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a" FOREIGN KEY ("subProduct") REFERENCES "digifranchise_sub_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_table" ADD CONSTRAINT "FK_7170f7687d93372cc0c1adffc68" FOREIGN KEY ("subService") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP CONSTRAINT "FK_7170f7687d93372cc0c1adffc68"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_service_category" DROP CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP COLUMN "subService"`);
        await queryRunner.query(`ALTER TABLE "order_table" DROP COLUMN "subProduct"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP COLUMN "subProductId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP COLUMN "subServiceId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`DROP TABLE "digifranchise_sub_service_category"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
