import { MigrationInterface, QueryRunner } from "typeorm";

export class EditDigifranchiseOwnershipEntity1709045063065 implements MigrationInterface {
    name = 'EditDigifranchiseOwnershipEntity1709045063065'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL, "costPerItem" integer NOT NULL, "totalValue" integer NOT NULL, "dateReceived" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "inventoryId" uuid NOT NULL, CONSTRAINT "PK_1528e3203da22723e29566514f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "franchiseId" character varying NOT NULL, "itemName" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "digifranchiseName" character varying(255), "description" text, "status" character varying(255) NOT NULL DEFAULT '2', "digifranchiseFee" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, CONSTRAINT "PK_b4e302f70d8b71fff39535ce172" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying, "phoneNumber" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "image" character varying, "idImage" character varying, "gender" character varying, "race" character varying, "homeAddress" character varying, "educationLevel" character varying, "currentActivity" character varying, "fieldOfStudy" character varying, "qualifications" json, "professionalBody" json, "isProfileComplete" boolean DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "deleteAt" TIMESTAMP, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_3bd3f2e16165d1dac3e8e13286" ON "user" ("image") `);
        await queryRunner.query(`CREATE INDEX "IDX_d03cc9951fbb73d092fa53127e" ON "user" ("idImage") `);
        await queryRunner.query(`CREATE INDEX "IDX_a0f3f1de3c7590ddf4299b6596" ON "user" ("gender") `);
        await queryRunner.query(`CREATE INDEX "IDX_91c1ef85a7e6c89eaeec99bfd6" ON "user" ("race") `);
        await queryRunner.query(`CREATE INDEX "IDX_9086fd0adfc3fdd84a443dd1b1" ON "user" ("homeAddress") `);
        await queryRunner.query(`CREATE INDEX "IDX_083056026899d829066008244b" ON "user" ("educationLevel") `);
        await queryRunner.query(`CREATE INDEX "IDX_772c766ebfc783bb03fa5e3404" ON "user" ("currentActivity") `);
        await queryRunner.query(`CREATE INDEX "IDX_a5e03f420f37f1f2270ec3f7a9" ON "user" ("fieldOfStudy") `);
        await queryRunner.query(`CREATE TABLE "digifranchise_service_offered" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "serviceName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, "userId" uuid, CONSTRAINT "PK_afa74ced0cfc1ef27e818336d08" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_owner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying(255) NOT NULL, "digifranchiseId" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchise" uuid, CONSTRAINT "PK_c2e97b38553384a30b7eaa2119d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productName" text NOT NULL, "description" text NOT NULL, "unitPrice" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "digifranchiseId" uuid, CONSTRAINT "PK_d0a78c3c6099881ff03408a6466" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_compliance_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "companyRegisterationNumber" character varying NOT NULL, "taxNumber" character varying NOT NULL, "taxClearencePin" character varying NOT NULL, "coidaRegisteration" character varying NOT NULL, "uifRegistration" character varying NOT NULL, "workMansCompensation" character varying NOT NULL, "sdlNumber" character varying NOT NULL, "otherComplianceDocs" character varying NOT NULL, "uploadedDocs" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, CONSTRAINT "REL_aaf18ed9b15cc56f76043dc0d5" UNIQUE ("ownedDigifranchiseId"), CONSTRAINT "PK_a1fa2dda83341520b251af11b4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "operating_parameters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "salesPaidByCreditCard" numeric(5,2) NOT NULL, "salesMadeOnCredit" numeric(5,2) NOT NULL, "averageCreditorTerms" integer NOT NULL, "averageDebtorTerms" integer NOT NULL, "operatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_10e28996d81cb21f85abb2975fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "income" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying(255) NOT NULL, "quantity" integer NOT NULL, "unityCost" numeric(10,2) NOT NULL, "totalAmount" numeric(10,2) NOT NULL, "description" character varying(255) NOT NULL, "incomeDate" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_29a10f17b97568f70cee8586d58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "funding" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "source" character varying NOT NULL, "monthReceived" integer NOT NULL, "repaymentTerm" integer NOT NULL, "annualInterestRate" numeric(5,2) NOT NULL, "fundedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_096afc0d11a08deb52da61f039e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "fixed_expense_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fixedExpense" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "userId" uuid, CONSTRAINT "UQ_0c2eda1361b7154b738c26b5471" UNIQUE ("fixedExpense"), CONSTRAINT "PK_7854a2cc680e3044f754d290afc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."expense_arrangement_enum" AS ENUM('cash', 'credit')`);
        await queryRunner.query(`CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "arrangement" "public"."expense_arrangement_enum" NOT NULL DEFAULT 'cash', "monthlyExpense" json NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, "fixedExpenseId" uuid, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deposit" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item" character varying NOT NULL, "monthPaid" integer NOT NULL, "monthRecovered" integer NOT NULL, "depositAmount" numeric(10,2) NOT NULL, "depositedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_6654b4be449dadfd9d03a324b61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "purchasePrice" numeric(10,2) NOT NULL, "purchaseDate" TIMESTAMP NOT NULL DEFAULT now(), "depreciationRate" integer NOT NULL, "currentValue" numeric(10,2) NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "franchiseId" uuid, CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "digifranchise_general_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "digifranchiseName" character varying NOT NULL, "facebookHandle" character varying NOT NULL, "tiktokHandle" character varying NOT NULL, "instagramHandle" character varying NOT NULL, "xHandle" character varying NOT NULL, "address" character varying NOT NULL, "connectNumber" character varying NOT NULL, "otherMobileNumber" character varying NOT NULL, "aboutCompany" character varying NOT NULL, "location" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP, "ownedDigifranchiseId" uuid, CONSTRAINT "REL_628ee3d8e80b874079732697d6" UNIQUE ("ownedDigifranchiseId"), CONSTRAINT "PK_3e04643b9802b6e9df3c9940334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `);
        await queryRunner.query(`ALTER TABLE "inventory_entries" ADD CONSTRAINT "FK_6966c038058689cd59a10abe09d" FOREIGN KEY ("inventoryId") REFERENCES "inventory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" ADD CONSTRAINT "FK_c4729ec60a40846cd2c5415828a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" ADD CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b" FOREIGN KEY ("digifranchise") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" ADD CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98" FOREIGN KEY ("digifranchiseId") REFERENCES "digifranchise"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" ADD CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" ADD CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "income" ADD CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funding" ADD CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" ADD CONSTRAINT "FK_a575d50e871d42879a93d145f09" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_e84934482e42bb311c168a725c3" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expense" ADD CONSTRAINT "FK_c65a872a294e35ecc04521cc89c" FOREIGN KEY ("fixedExpenseId") REFERENCES "fixed_expense_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "deposit" ADD CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asset" ADD CONSTRAINT "FK_1e0bf855767085f945f8f5be914" FOREIGN KEY ("franchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" ADD CONSTRAINT "FK_628ee3d8e80b874079732697d61" FOREIGN KEY ("ownedDigifranchiseId") REFERENCES "digifranchise_owner"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_general_info" DROP CONSTRAINT "FK_628ee3d8e80b874079732697d61"`);
        await queryRunner.query(`ALTER TABLE "asset" DROP CONSTRAINT "FK_1e0bf855767085f945f8f5be914"`);
        await queryRunner.query(`ALTER TABLE "deposit" DROP CONSTRAINT "FK_b32f49db1bca4fe35989d2af5d7"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_c65a872a294e35ecc04521cc89c"`);
        await queryRunner.query(`ALTER TABLE "expense" DROP CONSTRAINT "FK_e84934482e42bb311c168a725c3"`);
        await queryRunner.query(`ALTER TABLE "fixed_expense_category" DROP CONSTRAINT "FK_a575d50e871d42879a93d145f09"`);
        await queryRunner.query(`ALTER TABLE "funding" DROP CONSTRAINT "FK_67a5d7184b00fb46d0fce87b613"`);
        await queryRunner.query(`ALTER TABLE "income" DROP CONSTRAINT "FK_e52374c32a401dffbe43b2e0a03"`);
        await queryRunner.query(`ALTER TABLE "operating_parameters" DROP CONSTRAINT "FK_2dfa15ee5f0642edd7284c7f550"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_compliance_info" DROP CONSTRAINT "FK_aaf18ed9b15cc56f76043dc0d5a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_product" DROP CONSTRAINT "FK_73cb62e2abf8bae34a6d5d77b98"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_owner" DROP CONSTRAINT "FK_804ff656af3f03a41f206f3ae0b"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_c4729ec60a40846cd2c5415828a"`);
        await queryRunner.query(`ALTER TABLE "digifranchise_service_offered" DROP CONSTRAINT "FK_211f3143b8b2f126098ede2f5c1"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`);
        await queryRunner.query(`ALTER TABLE "inventory_entries" DROP CONSTRAINT "FK_6966c038058689cd59a10abe09d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "digifranchise_general_info"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP TABLE "deposit"`);
        await queryRunner.query(`DROP TABLE "expense"`);
        await queryRunner.query(`DROP TYPE "public"."expense_arrangement_enum"`);
        await queryRunner.query(`DROP TABLE "fixed_expense_category"`);
        await queryRunner.query(`DROP TABLE "funding"`);
        await queryRunner.query(`DROP TABLE "income"`);
        await queryRunner.query(`DROP TABLE "operating_parameters"`);
        await queryRunner.query(`DROP TABLE "digifranchise_compliance_info"`);
        await queryRunner.query(`DROP TABLE "digifranchise_product"`);
        await queryRunner.query(`DROP TABLE "digifranchise_owner"`);
        await queryRunner.query(`DROP TABLE "digifranchise_service_offered"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a5e03f420f37f1f2270ec3f7a9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_772c766ebfc783bb03fa5e3404"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_083056026899d829066008244b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9086fd0adfc3fdd84a443dd1b1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_91c1ef85a7e6c89eaeec99bfd6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0f3f1de3c7590ddf4299b6596"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d03cc9951fbb73d092fa53127e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3bd3f2e16165d1dac3e8e13286"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "status"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "digifranchise"`);
        await queryRunner.query(`DROP TABLE "inventory"`);
        await queryRunner.query(`DROP TABLE "inventory_entries"`);
    }

}
