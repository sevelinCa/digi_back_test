import { MigrationInterface, QueryRunner } from "typeorm";

export class MakingRatingReviewOptional1714981586443 implements MigrationInterface {
    name = 'MakingRatingReviewOptional1714981586443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating_order_table" ALTER COLUMN "review" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rating_order_table" ALTER COLUMN "review" SET NOT NULL`);
    }

}
