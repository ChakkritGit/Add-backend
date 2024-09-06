/*
  Warnings:

  - You are about to drop the column `CreatedByUserId` on the `Prescription` table. All the data in the column will be lost.
  - Made the column `UsedByUserId` on table `Prescription` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_CreatedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_UsedByUserId_fkey";

-- AlterTable
ALTER TABLE "Prescription" DROP COLUMN "CreatedByUserId",
ALTER COLUMN "UsedByUserId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_UsedByUserId_fkey" FOREIGN KEY ("UsedByUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
