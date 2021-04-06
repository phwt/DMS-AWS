/*
  Warnings:

  - A unique constraint covering the columns `[documentId]` on the table `Work` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Work_documentId_unique" ON "Work"("documentId");
