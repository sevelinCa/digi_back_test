import { MigrationInterface, QueryRunner } from "typeorm";

// export class EditBooleanToTrue1717595312629 implements MigrationInterface {
//   name = "EditBooleanToTrue1717595312629";

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "digifranchisePublishedWithCC" SET DEFAULT true`
//     );
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(
//       `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "digifranchisePublishedWithCC" SET DEFAULT false`
//     );
//   }
// }
export class EditBooleanToTrue1717595312629 implements MigrationInterface {
  name = "EditBooleanToTrue1717595312629";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD COLUMN "digifranchisePublishedWithCC" boolean DEFAULT true`
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "digifranchisePublishedWithCC" SET DEFAULT true`
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ALTER COLUMN "digifranchisePublishedWithCC" SET DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchisePublishedWithCC"`
    );
  }
}
