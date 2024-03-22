import { MigrationInterface, QueryRunner } from "typeorm";

export class DigifranchiseNewProductAndServiceColumn1711090309283 implements MigrationInterface {
    name = 'DigifranchiseNewProductAndServiceColumn1711090309283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_new_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "isSelected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_dd6df628460cc75bbd4018765de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_gallery_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "serviceId" uuid, "productId" uuid, CONSTRAINT "PK_2fba0ba82713da62f7f416d6232" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_new_service_offered" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "isSelected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_ddef909e97300cff7f4be7a4f5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_new_product" ADD CONSTRAINT "FK_a1a4693fb5cb13782698c743505" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_new_product" ADD CONSTRAINT "FK_fc1abbf0658726aa2b52008378c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_a44312fae83ef09e59763e246d1" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_new_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_ff2a3f51ce0717048e6ef290076" FOREIGN KEY ("productId") REFERENCES "digifranchise_new_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_new_service_offered" ADD CONSTRAINT "FK_b6882421216640b416cd25002ca" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_new_service_offered" ADD CONSTRAINT "FK_1a5b63a7498f5252f3fea3fb974" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_new_service_offered" DROP CONSTRAINT "FK_1a5b63a7498f5252f3fea3fb974"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_new_service_offered" DROP CONSTRAINT "FK_b6882421216640b416cd25002ca"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_ff2a3f51ce0717048e6ef290076"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_a44312fae83ef09e59763e246d1"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_new_product" DROP CONSTRAINT "FK_fc1abbf0658726aa2b52008378c"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_new_product" DROP CONSTRAINT "FK_a1a4693fb5cb13782698c743505"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`DROP TABLE "digifranchise_new_service_offered"`);
        await queryRunner.query(`DROP TABLE "digifranchise_gallery_image"`);
        await queryRunner.query(`DROP TABLE "digifranchise_new_product"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
