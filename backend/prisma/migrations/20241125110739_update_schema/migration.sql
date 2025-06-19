/*
  Warnings:

  - Added the required column `username` to the `forwarder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forwarder" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;
