/*
  Warnings:

  - Made the column `UserPincode` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "UserPincode" SET NOT NULL;
