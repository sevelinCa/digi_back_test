import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDigifranchiseExpenseTable1712090850689 implements MigrationInterface {
    name = 'AddDigifranchiseExpenseTable1712090850689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`CREATE TABLE "digifranchise_expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unityCost" numeric(10,2) NOT NULL, "purchaseDone" boolean NOT NULL DEFAULT false, "puchaseDate" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, "fixedExpenseId" uuid, CONSTRAINT "PK_c08febf813d9fe86fa62a407f50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_72bd905906249f664eb4e416988" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_3e61e1e202aaa8e8ffecc40ac41" FOREIGN KEY ("fixedExpenseId") REFERENCES "fixed_expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_3e61e1e202aaa8e8ffecc40ac41"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_72bd905906249f664eb4e416988"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" DROP COLUMN "digifranchiseOwnerId"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseOwnerId" uuid`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD "digifranchiseId" uuid`);
        await queryRunner.query(`DROP TABLE "digifranchise_expense"`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_e54de4b7aba4853d8f0c5540b84" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
