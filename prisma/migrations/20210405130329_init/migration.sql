/*
  Warnings:

  - The `state` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `Work` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `state` column on the `Work` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Document` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `documentId` to the `Work` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('M', 'P', 'W', 'F');

-- CreateEnum
CREATE TYPE "DocumentState" AS ENUM ('IN', 'RE', 'OB', 'RC');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('CREATE', 'EDIT', 'CANCLE');

-- CreateEnum
CREATE TYPE "WorkState" AS ENUM ('NEW', 'REVIEW', 'COMPLETED');

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "type",
ADD COLUMN     "type" "DocumentType" NOT NULL,
DROP COLUMN "state",
ADD COLUMN     "state" "DocumentState" NOT NULL DEFAULT E'IN';

-- AlterTable
ALTER TABLE "Work" ADD COLUMN     "documentId" INTEGER NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "WorkType" NOT NULL DEFAULT E'CREATE',
DROP COLUMN "state",
ADD COLUMN     "state" "WorkState" NOT NULL DEFAULT E'NEW',
ALTER COLUMN "create_date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "complete_date" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Work" ADD FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
