/*
  Warnings:

  - You are about to drop the column `area_code` on the `garbage` table. All the data in the column will be lost.
  - You are about to drop the column `area_code` on the `garbage_collection_schedules` table. All the data in the column will be lost.
  - The primary key for the `user_settings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `area_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `admins_areas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `areas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `areas_garbage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins_areas" DROP CONSTRAINT "admins_areas_area_code_fkey";

-- DropForeignKey
ALTER TABLE "admins_areas" DROP CONSTRAINT "admins_areas_user_id_fkey";

-- DropForeignKey
ALTER TABLE "areas_garbage" DROP CONSTRAINT "areas_garbage_area_code_fkey";

-- DropForeignKey
ALTER TABLE "areas_garbage" DROP CONSTRAINT "areas_garbage_garbage_id_fkey";

-- DropForeignKey
ALTER TABLE "garbage" DROP CONSTRAINT "garbage_area_code_fkey";

-- DropForeignKey
ALTER TABLE "garbage_collection_schedules" DROP CONSTRAINT "garbage_collection_schedules_area_code_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_area_code_fkey";

-- DropIndex
DROP INDEX "garbage_area_code_key";

-- AlterTable
ALTER TABLE "garbage" DROP COLUMN "area_code";

-- AlterTable
ALTER TABLE "garbage_collection_schedules" DROP COLUMN "area_code";

-- AlterTable
ALTER TABLE "user_settings" DROP CONSTRAINT "user_settings_pkey",
ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("user_id", "setting_key");

-- AlterTable
ALTER TABLE "users" DROP COLUMN "area_code";

-- DropTable
DROP TABLE "admins_areas";

-- DropTable
DROP TABLE "areas";

-- DropTable
DROP TABLE "areas_garbage";
