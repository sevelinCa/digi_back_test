import { MigrationInterface, QueryRunner } from "typeorm";

export class DigifranchiseOwnedProductAndServiceColumn1711110810864 implements MigrationInterface {
    name = 'DigifranchiseOwnedProductAndServiceColumn1711110810864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_owned_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "isSelected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_a08cc19803cd8c673b9efe78e9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_gallery_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "serviceId" uuid, "productId" uuid, CONSTRAINT "PK_2fba0ba82713da62f7f416d6232" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_owned_service_offered" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "isSelected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_bd14242eeb0033fd66a6b79ce68" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" ADD CONSTRAINT "FK_8d43277a43f24b4eaf10c88a0d1" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" ADD CONSTRAINT "FK_65f9460d48b52ef9492250e0ca1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_a44312fae83ef09e59763e246d1" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_owned_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_ff2a3f51ce0717048e6ef290076" FOREIGN KEY ("productId") REFERENCES "digifranchise_owned_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" ADD CONSTRAINT "FK_9337ae70e6cb247e9c12d6f7fdc" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" ADD CONSTRAINT "FK_5bb4b062267aabdef543861a68c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" DROP CONSTRAINT "FK_5bb4b062267aabdef543861a68c"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_service_offered" DROP CONSTRAINT "FK_9337ae70e6cb247e9c12d6f7fdc"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_ff2a3f51ce0717048e6ef290076"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_a44312fae83ef09e59763e246d1"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" DROP CONSTRAINT "FK_65f9460d48b52ef9492250e0ca1"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owned_product" DROP CONSTRAINT "FK_8d43277a43f24b4eaf10c88a0d1"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`DROP TABLE "digifranchise_owned_service_offered"`);
        await queryRunner.query(`DROP TABLE "digifranchise_gallery_image"`);
        await queryRunner.query(`DROP TABLE "digifranchise_owned_product"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
