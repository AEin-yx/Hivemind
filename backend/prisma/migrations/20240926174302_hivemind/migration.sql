/*
  Warnings:

  - Made the column `title` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Task_title_key";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "title" SET NOT NULL;
