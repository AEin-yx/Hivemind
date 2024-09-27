/*
  Warnings:

  - You are about to drop the column `balance_id` on the `Worker` table. All the data in the column will be lost.
  - You are about to drop the column `pending_amout` on the `Worker` table. All the data in the column will be lost.
  - Added the required column `pending_amount` to the `Worker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Worker" DROP COLUMN "balance_id",
DROP COLUMN "pending_amout",
ADD COLUMN     "pending_amount" INTEGER NOT NULL;
