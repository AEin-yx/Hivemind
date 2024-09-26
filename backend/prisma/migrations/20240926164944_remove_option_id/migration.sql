/*
  Warnings:

  - You are about to drop the column `option_id` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "option_id";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "title" DROP NOT NULL;

-- CreateTable
CREATE TABLE "playing_with_neon" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" REAL,

    CONSTRAINT "playing_with_neon_pkey" PRIMARY KEY ("id")
);
