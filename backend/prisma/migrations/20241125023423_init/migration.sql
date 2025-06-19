/*
  Warnings:

  - You are about to drop the column `listener_id` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the `forwader` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `listener` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `forwarder_id` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "logs" DROP CONSTRAINT "logs_listener_id_fkey";

-- AlterTable
ALTER TABLE "logs" DROP COLUMN "listener_id",
ADD COLUMN     "forwarder_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "forwader";

-- DropTable
DROP TABLE "listener";

-- CreateTable
CREATE TABLE "forwarder" (
    "id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "is_listen" BOOLEAN NOT NULL DEFAULT false,
    "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_date" TIMESTAMP(3),

    CONSTRAINT "forwarder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forwarder_telegram_id_key" ON "forwarder"("telegram_id");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_forwarder_id_fkey" FOREIGN KEY ("forwarder_id") REFERENCES "forwarder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
