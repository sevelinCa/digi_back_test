import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingCascadeOnFranchiseOwnerEntityRelations1718274010147
  implements MigrationInterface
{
  name = "AddingCascadeOnFranchiseOwnerEntityRelations1718274010147";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_10906938e9cd926e0bc37509f57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" DROP CONSTRAINT "FK_75694810d2bd701945c948c0316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_33f947c917ed59e29f91cde45a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_e40d756cb6e557a2a269b01276e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_0295f3e699e0bd609406f57f3d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_2135ef637158302a406973e7335"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_120377ed67b54c72cd2c0b95660"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_68c771d0efb4ca7a15b96d217b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" DROP CONSTRAINT "FK_1d9bee1b1bccfe03eeb99125cc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_c7f0f8d0a16f5c15da0f0dcd648"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_550779654f6c0c5419de37a3157"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP CONSTRAINT "FK_9878b0458c861b1fc94f1688eb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" DROP CONSTRAINT "FK_030ce5c3bf350175ee38b33c9f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_569b66bac409918e56b48ccb3dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_9267048230c4ec77167b1d9b403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_392835dc095933a11e48fe99901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_f8b867f7eb949923c2797c99a26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_9136759e57e7557937afdfa3075"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" DROP CONSTRAINT "FK_481065189f21e163c70e1caa6a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_18bd338852524484a32f3795ab7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enquiries_table" DROP CONSTRAINT "FK_a4174084afa043704b26c846f45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_time_slots" DROP CONSTRAINT "FK_0bb10729628acb8766a41785e37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "asset" DROP CONSTRAINT "FK_1e0bf855767085f945f8f5be914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_10906938e9cd926e0bc37509f57" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ADD CONSTRAINT "FK_75694810d2bd701945c948c0316" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_33f947c917ed59e29f91cde45a3" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_e40d756cb6e557a2a269b01276e" FOREIGN KEY ("ownerDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_0295f3e699e0bd609406f57f3d5" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_2135ef637158302a406973e7335" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_120377ed67b54c72cd2c0b95660" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_68c771d0efb4ca7a15b96d217b0" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_1d9bee1b1bccfe03eeb99125cc8" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_c7f0f8d0a16f5c15da0f0dcd648" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_550779654f6c0c5419de37a3157" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD CONSTRAINT "FK_9878b0458c861b1fc94f1688eb8" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" ADD CONSTRAINT "FK_030ce5c3bf350175ee38b33c9f5" FOREIGN KEY ("ownedFranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_569b66bac409918e56b48ccb3dd" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_9267048230c4ec77167b1d9b403" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_392835dc095933a11e48fe99901" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_f8b867f7eb949923c2797c99a26" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_9136759e57e7557937afdfa3075" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" ADD CONSTRAINT "FK_481065189f21e163c70e1caa6a7" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_18bd338852524484a32f3795ab7" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enquiries_table" ADD CONSTRAINT "FK_a4174084afa043704b26c846f45" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_time_slots" ADD CONSTRAINT "FK_0bb10729628acb8766a41785e37" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_1e0bf855767085f945f8f5be914" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`,
    );
    await queryRunner.query(
      `ALTER TABLE "asset" DROP CONSTRAINT "FK_1e0bf855767085f945f8f5be914"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_time_slots" DROP CONSTRAINT "FK_0bb10729628acb8766a41785e37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enquiries_table" DROP CONSTRAINT "FK_a4174084afa043704b26c846f45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_18bd338852524484a32f3795ab7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" DROP CONSTRAINT "FK_481065189f21e163c70e1caa6a7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_9136759e57e7557937afdfa3075"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_f8b867f7eb949923c2797c99a26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_392835dc095933a11e48fe99901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_9267048230c4ec77167b1d9b403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_569b66bac409918e56b48ccb3dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" DROP CONSTRAINT "FK_030ce5c3bf350175ee38b33c9f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP CONSTRAINT "FK_9878b0458c861b1fc94f1688eb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_550779654f6c0c5419de37a3157"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_c7f0f8d0a16f5c15da0f0dcd648"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" DROP CONSTRAINT "FK_1d9bee1b1bccfe03eeb99125cc8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_68c771d0efb4ca7a15b96d217b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_120377ed67b54c72cd2c0b95660"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_2135ef637158302a406973e7335"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_0295f3e699e0bd609406f57f3d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_e40d756cb6e557a2a269b01276e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_33f947c917ed59e29f91cde45a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" DROP CONSTRAINT "FK_75694810d2bd701945c948c0316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_10906938e9cd926e0bc37509f57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "asset" ADD CONSTRAINT "FK_1e0bf855767085f945f8f5be914" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_time_slots" ADD CONSTRAINT "FK_0bb10729628acb8766a41785e37" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enquiries_table" ADD CONSTRAINT "FK_a4174084afa043704b26c846f45" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_18bd338852524484a32f3795ab7" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_working_hours" ADD CONSTRAINT "FK_481065189f21e163c70e1caa6a7" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_9136759e57e7557937afdfa3075" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_f8b867f7eb949923c2797c99a26" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_392835dc095933a11e48fe99901" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_9267048230c4ec77167b1d9b403" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_569b66bac409918e56b48ccb3dd" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" ADD CONSTRAINT "FK_030ce5c3bf350175ee38b33c9f5" FOREIGN KEY ("ownedFranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD CONSTRAINT "FK_9878b0458c861b1fc94f1688eb8" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_550779654f6c0c5419de37a3157" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_c7f0f8d0a16f5c15da0f0dcd648" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_1d9bee1b1bccfe03eeb99125cc8" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_68c771d0efb4ca7a15b96d217b0" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_120377ed67b54c72cd2c0b95660" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_2135ef637158302a406973e7335" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_0295f3e699e0bd609406f57f3d5" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_e40d756cb6e557a2a269b01276e" FOREIGN KEY ("ownerDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_33f947c917ed59e29f91cde45a3" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ADD CONSTRAINT "FK_75694810d2bd701945c948c0316" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_10906938e9cd926e0bc37509f57" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
