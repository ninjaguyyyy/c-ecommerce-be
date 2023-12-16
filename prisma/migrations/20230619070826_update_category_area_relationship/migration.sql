/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `category_code` on the `garbage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[area_code]` on the table `garbage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `area_code` to the `garbage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `garbage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "garbage" DROP CONSTRAINT "garbage_category_code_fkey";

-- DropIndex
DROP INDEX "categories_code_key";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "code",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "garbage" DROP COLUMN "category_code",
ADD COLUMN     "area_code" TEXT NOT NULL,
ADD COLUMN     "category_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "garbage_area_code_key" ON "garbage"("area_code");

-- AddForeignKey
ALTER TABLE "garbage" ADD CONSTRAINT "garbage_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garbage" ADD CONSTRAINT "garbage_area_code_fkey" FOREIGN KEY ("area_code") REFERENCES "areas"("code") ON DELETE CASCADE ON UPDATE CASCADE;
