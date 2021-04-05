-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('MANUAL', 'PROCEDURE', 'WORK_INSTRUCTION', 'FORM');

-- CreateEnum
CREATE TYPE "DocumentState" AS ENUM ('IN_PROGRESS', 'RELEASED', 'OBSOLETE', 'RECALLED');

-- CreateEnum
CREATE TYPE "WorkType" AS ENUM ('CREATE', 'EDIT', 'CANCLE');

-- CreateEnum
CREATE TYPE "WorkState" AS ENUM ('NEW', 'REVIEW', 'COMPLETED');

-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "state" "DocumentState" NOT NULL DEFAULT E'IN_PROGRESS',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "type" "WorkType" NOT NULL DEFAULT E'CREATE',
    "state" "WorkState" NOT NULL DEFAULT E'NEW',
    "detail" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "complete_date" TIMESTAMP(3),
    "documentId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Work" ADD FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
