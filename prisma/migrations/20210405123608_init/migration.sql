-- CreateTable
CREATE TABLE "Document" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "create_date" TIMESTAMP(3) NOT NULL,
    "complete_date" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
