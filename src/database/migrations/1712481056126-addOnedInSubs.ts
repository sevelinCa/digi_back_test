import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOnedInSubs1712481056126 implements MigrationInterface {
    name = 'AddOnedInSubs1712481056126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_8b51f0a80c89d1dc7748a756c1d"`);
        await queryRunner.query(`ALTER TABLE "customer_management" DROP CONSTRAINT "FK_a456e18c923c7253a6d1f711943"`);
        await queryRunner.query(`ALTER TABLE "available_management" DROP CONSTRAINT "FK_2841c15d677aa9b3cc96784028a"`);
        await queryRunner.query(`ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_87f741f438c6e5f9d38f6c01285"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_12b6333a4399ebdbfe816e74f51"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "staff_management" DROP CONSTRAINT "FK_673b98e05518934b48132f98088"`);
        await queryRunner.query(`ALTER TABLE "supplier_management" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_management" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "available_management" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "unavailable_management" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "inventory_management" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "staff_management" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD "digifranchiseOwnedId" uuid`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD "digifranchiseOwnedId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_120377ed67b54c72cd2c0b95660" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_2135ef637158302a406973e7335" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_2135ef637158302a406973e7335"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_120377ed67b54c72cd2c0b95660"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_8045b1f51750c77a13d632d35af"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_product" DROP COLUMN "digifranchiseOwnedId"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_sub_services" DROP COLUMN "digifranchiseOwnedId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "ownedDigifranchise"`);
        await queryRunner.query(`ALTER TABLE "staff_management" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "ownedDigifranchise" uuid`);
        await queryRunner.query(`ALTER TABLE "inventory_management" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "unavailable_management" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "available_management" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_management" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "supplier_management" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "staff_management" ADD CONSTRAINT "FK_673b98e05518934b48132f98088" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_8045b1f51750c77a13d632d35af" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_12b6333a4399ebdbfe816e74f51" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_87f741f438c6e5f9d38f6c01285" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "available_management" ADD CONSTRAINT "FK_2841c15d677aa9b3cc96784028a" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_management" ADD CONSTRAINT "FK_a456e18c923c7253a6d1f711943" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_8b51f0a80c89d1dc7748a756c1d" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
