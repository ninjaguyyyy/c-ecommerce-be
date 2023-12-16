-- CreateEnum
CREATE TYPE "HouseType" AS ENUM ('House', 'Apartment');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "house_type" "HouseType";
