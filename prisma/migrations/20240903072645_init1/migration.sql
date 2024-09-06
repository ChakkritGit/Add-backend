/*
  Warnings:

  - Added the required column `Machine` to the `Orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Orders" ADD COLUMN     "Machine" VARCHAR(200) NOT NULL;
