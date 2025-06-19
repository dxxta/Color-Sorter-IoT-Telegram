-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "color" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3),
    "listener_id" TEXT NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listener" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3),

    CONSTRAINT "listener_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forwader" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3),

    CONSTRAINT "forwader_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forwader_telegram_id_key" ON "forwader"("telegram_id");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_listener_id_fkey" FOREIGN KEY ("listener_id") REFERENCES "listener"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
