import { MigrationInterface, QueryRunner } from "typeorm";

export class CleanUp1714297870060 implements MigrationInterface {
  name = "CleanUp1714297870060";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_8b51f0a80c89d1dc7748a756c1d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" DROP CONSTRAINT "FK_a456e18c923c7253a6d1f711943"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_60225831356d6a99720e2338068"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" DROP CONSTRAINT "FK_2841c15d677aa9b3cc96784028a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" DROP CONSTRAINT "FK_87f741f438c6e5f9d38f6c01285"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" DROP CONSTRAINT "FK_12b6333a4399ebdbfe816e74f51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP CONSTRAINT "FK_673b98e05518934b48132f98088"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" RENAME COLUMN "digifranchiseId" TO "ownedDigifranchise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" RENAME COLUMN "digifranchiseId" TO "ownedDigifranchise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" RENAME COLUMN "digifranchiseId" TO "ownedDigifranchise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" RENAME COLUMN "digifranchiseId" TO "ownedDigifranchise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" RENAME COLUMN "digifranchiseId" TO "ownedDigifranchise"`,
    );
    await queryRunner.query(
      `CREATE TABLE "digifranchise_service_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceCategoryName" character varying(255) NOT NULL, "unitPrice" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "serviceId" uuid, CONSTRAINT "PK_63547c1f159022c8b1caf7fb634" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "digifranchise_select_product_or_service_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSelected" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownerDigifranchise" uuid, "digifranchiseService" uuid, "franchiseProduct" uuid, "userId" uuid, CONSTRAINT "PK_b6c83ba81cb8647be16b2ccacfd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "digifranchise_sub_service_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceCategoryName" character varying(255) NOT NULL, "unitPrice" character varying(255) NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "subServiceId" uuid, CONSTRAINT "PK_452b4401dc0cbc16524e5c1db24" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "digifranchise_gallery_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "imageUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseServiceId" uuid, "digifranchiseProductId" uuid, "subServiceId" uuid, "subProductId" uuid, "digifranchiseOwnedId" uuid, CONSTRAINT "PK_2fba0ba82713da62f7f416d6232" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "digifranchise_expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "unityCost" numeric(10,2) NOT NULL, "purchaseDone" boolean NOT NULL DEFAULT false, "puchaseDate" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchise" uuid, "fixedExpense" uuid, CONSTRAINT "PK_c08febf813d9fe86fa62a407f50" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."availability_allowedtimeslotunits_enum" AS ENUM('15', '30', '60', '90')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."availability_breaktimebetweenbookedslots_enum" AS ENUM('15', '30', '60')`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "allowedTimeSlotUnits" "public"."availability_allowedtimeslotunits_enum" NOT NULL DEFAULT '30', "breakTimeBetweenBookedSlots" "public"."availability_breaktimebetweenbookedslots_enum" NOT NULL DEFAULT '15', "allowBookingOnPublicHolidays" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "ownedDigifranchise" uuid, CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability_week_days" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day" character varying(255) NOT NULL, "workingDate" TIMESTAMP, "isDayFullBooked" boolean NOT NULL DEFAULT false, "availabilityCounts" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "availabilityId" uuid, "ownedDigifranchise" uuid, "unavailabilityId" uuid, "availabilitySlotsDetailsId" uuid, CONSTRAINT "PK_598829a14e3e7bde460195fb0a1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability_day_time" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "isBooked" boolean NOT NULL DEFAULT false, "availableTimeSlots" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "weekDay" uuid, "availabilityId" uuid, "ownedDigifranchise" uuid, "availabilitySlotsDetailsId" uuid, CONSTRAINT "PK_2425a3a697cb9750d6d520e59d9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "unavailability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "workingDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "ownedDigifranchise" uuid, "availabilityWeekDaysId" uuid, "availabilityId" uuid, CONSTRAINT "PK_176e6b52ee1b44acea3b66e8aac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability_slots_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSlotBooked" boolean NOT NULL DEFAULT false, "availabilityTimeSlotsDetails" json, "workingDate" TIMESTAMP, "day" character varying(255) NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "availabilityDayTime" uuid, "availabilityWeekDays" uuid, "ownedDigifranchise" uuid, "availabilityId" uuid, CONSTRAINT "PK_76739667fc3e9b922c625c41ae9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability_slots_time_one_one" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isSlotBooked" boolean NOT NULL DEFAULT false, "singleAvailabilityTimeSlots" json, "workingDate" TIMESTAMP, "day" character varying(255) NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "availabilityDayTime" uuid, "availabilityWeekDays" uuid, "ownedDigifranchise" uuid, "availabilityId" uuid, CONSTRAINT "PK_d1882549935795f21647282b601" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "availability_booked_slots" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "slotId" uuid, CONSTRAINT "PK_258a7f6173962f2ceb02c31d363" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_table_status_enum" AS ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "orderAdditionalInfo" json, "quantity" integer NOT NULL, "orderNumber" integer NOT NULL, "unitPrice" character varying(255) NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "status" "public"."order_table_status_enum" NOT NULL DEFAULT 'PENDING', "OrderDate" TIMESTAMP NOT NULL DEFAULT now(), "vatAmount" numeric(10,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "productId" uuid, "serviceId" uuid, "subProduct" uuid, "subService" uuid, "ownedDigifranchise" uuid, CONSTRAINT "PK_2e52c3d2ee23b941afed22f6a38" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_basic_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullNames" text NOT NULL, "contactDetails" text NOT NULL, "address" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "order" uuid, CONSTRAINT "PK_d7750262a8c5631f16cefe50401" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_issue_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issue_description" text NOT NULL, "isSelected" boolean NOT NULL DEFAULT false, "orderAdditionalInfo" json, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "order" uuid, CONSTRAINT "PK_5217487197177105c8fcf28caaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_complaints_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issues" json, "additional_information" text NOT NULL, "refund_requested" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "order" uuid, CONSTRAINT "PK_54f300ba262fc3d8ae7fbd91098" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rating_order_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "review" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "orderId" uuid, CONSTRAINT "PK_65a008f02114793284e2184790a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "rate_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "rateName" character varying(255) NOT NULL, "rateNumber" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_8cb5ecb6da6da404b2cbfae4c30" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_subscription" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, "digifranchiseOwnerId" uuid, CONSTRAINT "PK_1a570a0f1783fbcf6123f18751f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "enquiries_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "names" text NOT NULL, "phone_number" integer NOT NULL, "email" text NOT NULL, "description" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseOwnerId" uuid, CONSTRAINT "PK_acc6907713479996e83966f5f83" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "calender_event_guest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "customerId" uuid, "eventId" uuid, CONSTRAINT "PK_4db8f464545f64578e87f22e18c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP COLUMN "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP COLUMN "serviceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP COLUMN "digifranchiseId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "dateOfBirth" date`);
    await queryRunner.query(
      `ALTER TABLE "digifranchise" ADD "digifranchiseImg" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "connectNumberWithOutCountryCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "otherMobileNumberWithOutCountryCode" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" ADD "digifranchisePublished" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD "digifranchiseOwnedId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD "digifranchiseOwnedId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD "digifranchiseProductId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD "digifranchiseOwnedId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD "digifranchiseServiceId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD "digifranchiseOwnedId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD "image" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD "ownedDigifranchise" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" ADD "ownedFranchiseId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" ADD "userEmail" character varying(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" ALTER COLUMN "name" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_10906938e9cd926e0bc37509f57" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ADD CONSTRAINT "FK_75694810d2bd701945c948c0316" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_category" ADD CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_33f947c917ed59e29f91cde45a3" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_e40d756cb6e557a2a269b01276e" FOREIGN KEY ("ownerDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_c80c8767cedc790c17243a5e57a" FOREIGN KEY ("digifranchiseService") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_a730ef63a5affd24044c4134030" FOREIGN KEY ("franchiseProduct") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" ADD CONSTRAINT "FK_d8bcabd27efae3b578e215182ee" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_0295f3e699e0bd609406f57f3d5" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_60e78e864a4429c58348e3a2845" FOREIGN KEY ("digifranchiseProductId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_2135ef637158302a406973e7335" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_service_category" ADD CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_df1712e88c792388ca3f60e14d3" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_120377ed67b54c72cd2c0b95660" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556" FOREIGN KEY ("digifranchiseServiceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_b421043cbc4ef6382596af55390" FOREIGN KEY ("digifranchiseProductId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2" FOREIGN KEY ("subServiceId") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f" FOREIGN KEY ("subProductId") REFERENCES "digifranchise_sub_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" ADD CONSTRAINT "FK_68c771d0efb4ca7a15b96d217b0" FOREIGN KEY ("digifranchiseOwnedId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_465375308d5b5d8079a4d9e933d" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" ADD CONSTRAINT "FK_c07ad4355ea31f770f26a0d3b9d" FOREIGN KEY ("fixedExpense") REFERENCES "fixed_expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_1d9bee1b1bccfe03eeb99125cc8" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_c7f0f8d0a16f5c15da0f0dcd648" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_550779654f6c0c5419de37a3157" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD CONSTRAINT "FK_9878b0458c861b1fc94f1688eb8" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" ADD CONSTRAINT "FK_030ce5c3bf350175ee38b33c9f5" FOREIGN KEY ("ownedFranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_569b66bac409918e56b48ccb3dd" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_86151d70a4800f8526d40811e08" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_9267048230c4ec77167b1d9b403" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae" FOREIGN KEY ("unavailabilityId") REFERENCES "unavailability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" ADD CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_824735b6e3ed7ec5eabc9d76222" FOREIGN KEY ("weekDay") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_d9a22f2c75d17c24d40482df349" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" ADD CONSTRAINT "FK_ae2d7e60007de6eca161274a97a" FOREIGN KEY ("availabilitySlotsDetailsId") REFERENCES "availability_slots_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_e21814e44acef02ccba5977885f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_392835dc095933a11e48fe99901" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_69da644f9ad6db633ec12577f59" FOREIGN KEY ("availabilityWeekDaysId") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" ADD CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_37207487c424dc59d9f0de59db5" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_f8b867f7eb949923c2797c99a26" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" ADD CONSTRAINT "FK_d6097137fe87e90a09d934e3970" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6" FOREIGN KEY ("availabilityDayTime") REFERENCES "availability_day_time"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_5f874121cc3db70869721cbec08" FOREIGN KEY ("availabilityWeekDays") REFERENCES "availability_week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_9136759e57e7557937afdfa3075" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" ADD CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d" FOREIGN KEY ("availabilityId") REFERENCES "availability"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_f5b7fc82f02c5c427647d18b030" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" ADD CONSTRAINT "FK_89b14ce607290844cbfb4daa20a" FOREIGN KEY ("slotId") REFERENCES "availability_slots_time_one_one"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_6702e6613ff095d78ca480e326a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a" FOREIGN KEY ("subProduct") REFERENCES "digifranchise_sub_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_7170f7687d93372cc0c1adffc68" FOREIGN KEY ("subService") REFERENCES "digifranchise_sub_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" ADD CONSTRAINT "FK_18bd338852524484a32f3795ab7" FOREIGN KEY ("ownedDigifranchise") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_basic_info" ADD CONSTRAINT "FK_200ab288cdef21ff36691b96d9b" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" ADD CONSTRAINT "FK_787811b8ffe5d8606e35b57ba51" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" ADD CONSTRAINT "FK_280b677ce3d1795ddcd214bac41" FOREIGN KEY ("order") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" ADD CONSTRAINT "FK_7f0dc3a05b9990e9e73a2dfb0b4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" ADD CONSTRAINT "FK_bfde6b1c736cdbe135d4ee0216a" FOREIGN KEY ("orderId") REFERENCES "order_table"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" ADD CONSTRAINT "FK_b4059529c205d91c7d138685b55" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "enquiries_table" ADD CONSTRAINT "FK_a4174084afa043704b26c846f45" FOREIGN KEY ("digifranchiseOwnerId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_event_guest" ADD CONSTRAINT "FK_3f8676d72b00c305f1742696a4c" FOREIGN KEY ("customerId") REFERENCES "customer_management"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_event_guest" ADD CONSTRAINT "FK_191f99a2329d5b373c99aa15acf" FOREIGN KEY ("eventId") REFERENCES "calender_events"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "calender_event_guest" DROP CONSTRAINT "FK_191f99a2329d5b373c99aa15acf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_event_guest" DROP CONSTRAINT "FK_3f8676d72b00c305f1742696a4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "enquiries_table" DROP CONSTRAINT "FK_a4174084afa043704b26c846f45"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_b4059529c205d91c7d138685b55"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_subscription" DROP CONSTRAINT "FK_19265fb72d392fa655e6dc7f1dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" DROP CONSTRAINT "FK_bfde6b1c736cdbe135d4ee0216a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rating_order_table" DROP CONSTRAINT "FK_7f0dc3a05b9990e9e73a2dfb0b4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_complaints_table" DROP CONSTRAINT "FK_280b677ce3d1795ddcd214bac41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_issue_table" DROP CONSTRAINT "FK_787811b8ffe5d8606e35b57ba51"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_basic_info" DROP CONSTRAINT "FK_200ab288cdef21ff36691b96d9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_18bd338852524484a32f3795ab7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_7170f7687d93372cc0c1adffc68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_a8a4aa6db3ecccb543a8e083e0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_ad92edbae545f0be95b4a1d45dc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_2123af1e640c6ebb5916bac50d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_table" DROP CONSTRAINT "FK_6702e6613ff095d78ca480e326a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" DROP CONSTRAINT "FK_89b14ce607290844cbfb4daa20a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_booked_slots" DROP CONSTRAINT "FK_f5b7fc82f02c5c427647d18b030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_c55830852b43c72edaa1c87ef5d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_9136759e57e7557937afdfa3075"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_5f874121cc3db70869721cbec08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_time_one_one" DROP CONSTRAINT "FK_45762ce41e7b96dc7853810b7d6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_d6097137fe87e90a09d934e3970"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_f8b867f7eb949923c2797c99a26"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_37207487c424dc59d9f0de59db5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_slots_details" DROP CONSTRAINT "FK_c2b553ce6ea8024db0c0ebd76bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_614e5860cbaab23cdf0fbd6b89c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_69da644f9ad6db633ec12577f59"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_392835dc095933a11e48fe99901"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailability" DROP CONSTRAINT "FK_e21814e44acef02ccba5977885f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_ae2d7e60007de6eca161274a97a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_d9a22f2c75d17c24d40482df349"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_1d30ef0b45d4439abf2f979a812"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_day_time" DROP CONSTRAINT "FK_824735b6e3ed7ec5eabc9d76222"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_8c1df98ed8d874f9284a3101ea0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_0f4d0bb222d42ea6efc5b5085ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_9267048230c4ec77167b1d9b403"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability_week_days" DROP CONSTRAINT "FK_86151d70a4800f8526d40811e08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_569b66bac409918e56b48ccb3dd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_42a42b693f05f17e56d1d9ba93f"`,
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
      `ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_c07ad4355ea31f770f26a0d3b9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_expense" DROP CONSTRAINT "FK_465375308d5b5d8079a4d9e933d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_68c771d0efb4ca7a15b96d217b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_d6c2685873d63d3395e9dcb9b1f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_ca0bd1fb94e3f5a14c72bdcb7d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_b421043cbc4ef6382596af55390"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_gallery_image" DROP CONSTRAINT "FK_2f7e6c72ac59db3b9e5e702a556"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_120377ed67b54c72cd2c0b95660"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP CONSTRAINT "FK_df1712e88c792388ca3f60e14d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_service_category" DROP CONSTRAINT "FK_5d9c767ba9555106fa4f3987e43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_2135ef637158302a406973e7335"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP CONSTRAINT "FK_60e78e864a4429c58348e3a2845"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_0295f3e699e0bd609406f57f3d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_d8bcabd27efae3b578e215182ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_a730ef63a5affd24044c4134030"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_c80c8767cedc790c17243a5e57a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_select_product_or_service_table" DROP CONSTRAINT "FK_e40d756cb6e557a2a269b01276e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_33f947c917ed59e29f91cde45a3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_category" DROP CONSTRAINT "FK_240b0c23c7c4f0edf38fb827910"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" DROP CONSTRAINT "FK_75694810d2bd701945c948c0316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" DROP CONSTRAINT "FK_10906938e9cd926e0bc37509f57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" ALTER COLUMN "name" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_owner" DROP COLUMN "userEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "calender_venue" DROP COLUMN "ownedFranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP COLUMN "ownedDigifranchise"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" DROP COLUMN "image"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP COLUMN "digifranchiseOwnedId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" DROP COLUMN "digifranchiseServiceId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP COLUMN "digifranchiseOwnedId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" DROP COLUMN "digifranchiseProductId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_service_offered" DROP COLUMN "digifranchiseOwnedId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_product" DROP COLUMN "digifranchiseOwnedId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "digifranchisePublished"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "otherMobileNumberWithOutCountryCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_general_info" DROP COLUMN "connectNumberWithOutCountryCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise" DROP COLUMN "digifranchiseImg"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dateOfBirth"`);
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD "digifranchiseId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD "serviceId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD "productId" uuid`,
    );
    await queryRunner.query(`DROP TABLE "calender_event_guest"`);
    await queryRunner.query(`DROP TABLE "enquiries_table"`);
    await queryRunner.query(`DROP TABLE "customer_subscription"`);
    await queryRunner.query(`DROP TABLE "rate_table"`);
    await queryRunner.query(`DROP TABLE "rating_order_table"`);
    await queryRunner.query(`DROP TABLE "order_complaints_table"`);
    await queryRunner.query(`DROP TABLE "order_issue_table"`);
    await queryRunner.query(`DROP TABLE "order_basic_info"`);
    await queryRunner.query(`DROP TABLE "order_table"`);
    await queryRunner.query(`DROP TYPE "public"."order_table_status_enum"`);
    await queryRunner.query(`DROP TABLE "availability_booked_slots"`);
    await queryRunner.query(`DROP TABLE "availability_slots_time_one_one"`);
    await queryRunner.query(`DROP TABLE "availability_slots_details"`);
    await queryRunner.query(`DROP TABLE "unavailability"`);
    await queryRunner.query(`DROP TABLE "availability_day_time"`);
    await queryRunner.query(`DROP TABLE "availability_week_days"`);
    await queryRunner.query(`DROP TABLE "availability"`);
    await queryRunner.query(
      `DROP TYPE "public"."availability_breaktimebetweenbookedslots_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."availability_allowedtimeslotunits_enum"`,
    );
    await queryRunner.query(`DROP TABLE "digifranchise_expense"`);
    await queryRunner.query(`DROP TABLE "digifranchise_gallery_image"`);
    await queryRunner.query(`DROP TABLE "digifranchise_sub_service_category"`);
    await queryRunner.query(
      `DROP TABLE "digifranchise_select_product_or_service_table"`,
    );
    await queryRunner.query(`DROP TABLE "digifranchise_service_category"`);
    await queryRunner.query(
      `ALTER TABLE "inventory_management" RENAME COLUMN "ownedDigifranchise" TO "digifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" RENAME COLUMN "ownedDigifranchise" TO "digifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" RENAME COLUMN "ownedDigifranchise" TO "digifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" RENAME COLUMN "ownedDigifranchise" TO "digifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" RENAME COLUMN "ownedDigifranchise" TO "digifranchiseId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "staff_management" ADD CONSTRAINT "FK_673b98e05518934b48132f98088" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_management" ADD CONSTRAINT "FK_12b6333a4399ebdbfe816e74f51" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "unavailable_management" ADD CONSTRAINT "FK_87f741f438c6e5f9d38f6c01285" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "available_management" ADD CONSTRAINT "FK_2841c15d677aa9b3cc96784028a" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_services" ADD CONSTRAINT "FK_60225831356d6a99720e2338068" FOREIGN KEY ("serviceId") REFERENCES "digifranchise_service_offered"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "digifranchise_sub_product" ADD CONSTRAINT "FK_178e8f5d5c519e49c5424b7b67d" FOREIGN KEY ("productId") REFERENCES "digifranchise_product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_management" ADD CONSTRAINT "FK_a456e18c923c7253a6d1f711943" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "supplier_management" ADD CONSTRAINT "FK_8b51f0a80c89d1dc7748a756c1d" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
