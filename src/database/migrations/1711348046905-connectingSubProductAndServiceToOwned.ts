import { MigrationInterface, QueryRunner } from "typeorm";

export class ConnectingSubProductAndServiceToOwned1711348046905 implements MigrationInterface {
    name = 'ConnectingSubProductAndServiceToOwned1711348046905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" DROP CONSTRAINT "FK_65f9460d48b52ef9492250e0ca1"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" DROP CONSTRAINT "FK_5bb4b062267aabdef543861a68c"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_60225831356d6a99720e2338068"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" RENAME COLUMN "serviceId" TO "ownedServiceId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" RENAME COLUMN "productId" TO "ownedProductId"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_owned_service_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceCategoryName" character varying(255) NOT NULL, "unitPrice" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedServiceId" uuid, CONSTRAINT "PK_622a74c1865f0a0dec06cf3c69b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_7744fe7cf2b182d8ec90e05c571" FOREIGN KEY ("ownedServiceId") REFERENCES "digifranchise_owned_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_f8dd242ee713e1556c64cbae57a" FOREIGN KEY ("ownedProductId") REFERENCES "digifranchise_owned_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_category" ADD CONSTRAINT "FK_edc5849e45d956633975e2ad0b3" FOREIGN KEY ("ownedServiceId") REFERENCES "digifranchise_owned_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_category" DROP CONSTRAINT "FK_edc5849e45d956633975e2ad0b3"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_f8dd242ee713e1556c64cbae57a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_7744fe7cf2b182d8ec90e05c571"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`DROP TABLE "digifranchise_owned_service_category"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" RENAME COLUMN "ownedProductId" TO "productId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" RENAME COLUMN "ownedServiceId" TO "serviceId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_60225831356d6a99720e2338068" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" ADD CONSTRAINT "FK_5bb4b062267aabdef543861a68c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" ADD CONSTRAINT "FK_65f9460d48b52ef9492250e0ca1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
