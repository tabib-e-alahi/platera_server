/*
  Warnings:

  - The values [DELETED] on the enum `userAccountStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "userAccountStatus_new" AS ENUM ('ACTIVE', 'SUSPENDED');
ALTER TABLE "public"."user" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "status" TYPE "userAccountStatus_new" USING ("status"::text::"userAccountStatus_new");
ALTER TYPE "userAccountStatus" RENAME TO "userAccountStatus_old";
ALTER TYPE "userAccountStatus_new" RENAME TO "userAccountStatus";
DROP TYPE "public"."userAccountStatus_old";
ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;
