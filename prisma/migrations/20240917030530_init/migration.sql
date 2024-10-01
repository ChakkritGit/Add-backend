/*
  Warnings:

  - You are about to drop the column `Inventorytatus` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "Inventorytatus",
ADD COLUMN     "InventoryStatus" BOOLEAN NOT NULL DEFAULT false;
