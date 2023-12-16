/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('Recycle', 'Waste');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('Draft', 'Successful', 'Cancelled', 'SystemCancelled');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('Text', 'Number', 'RichText');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ADD COLUMN     "apartment_name" TEXT,
ADD COLUMN     "area_code" TEXT,
ADD COLUMN     "furigana_name" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "post_code" TEXT,
ADD COLUMN     "room_number" TEXT,
ADD COLUMN     "street_address" TEXT;

-- CreateTable
CREATE TABLE "areas" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "admins_areas" (
    "user_id" INTEGER NOT NULL,
    "area_code" TEXT NOT NULL,

    CONSTRAINT "admins_areas_pkey" PRIMARY KEY ("user_id","area_code")
);

-- CreateTable
CREATE TABLE "phone_verification" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "verified_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "phone_verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "garbage" (
    "id" SERIAL NOT NULL,
    "category_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DECIMAL(65,30),
    "point" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "garbage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas_garbage" (
    "garbage_id" INTEGER NOT NULL,
    "area_code" TEXT NOT NULL,

    CONSTRAINT "areas_garbage_pkey" PRIMARY KEY ("area_code","garbage_id")
);

-- CreateTable
CREATE TABLE "garbage_registrations" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "RegistrationType" NOT NULL,
    "date" DATE NOT NULL,
    "status" "RegistrationStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "garbage_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garbage_registration_details" (
    "id" SERIAL NOT NULL,
    "registration_id" TEXT NOT NULL,
    "garbage_id" INTEGER NOT NULL,
    "price" DECIMAL(65,30),
    "image_front" TEXT,
    "image_back" TEXT,
    "image_left" TEXT,
    "image_right" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garbage_registration_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "garbage_collection_schedules" (
    "id" SERIAL NOT NULL,
    "area_code" TEXT NOT NULL,
    "dateDrom" DATE NOT NULL,
    "dateTo" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "garbage_collection_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" SERIAL NOT NULL,
    "room_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_rooms_users" (
    "room_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "chat_rooms_users_pkey" PRIMARY KEY ("room_id","user_id")
);

-- CreateTable
CREATE TABLE "app_settings" (
    "setting_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "data_type" "DataType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_settings_pkey" PRIMARY KEY ("setting_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "areas_code_key" ON "areas"("code");

-- CreateIndex
CREATE UNIQUE INDEX "admins_areas_user_id_key" ON "admins_areas"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_areas_area_code_key" ON "admins_areas"("area_code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE UNIQUE INDEX "garbage_registrations_id_key" ON "garbage_registrations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_area_code_fkey" FOREIGN KEY ("area_code") REFERENCES "areas"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins_areas" ADD CONSTRAINT "admins_areas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins_areas" ADD CONSTRAINT "admins_areas_area_code_fkey" FOREIGN KEY ("area_code") REFERENCES "areas"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garbage" ADD CONSTRAINT "garbage_category_code_fkey" FOREIGN KEY ("category_code") REFERENCES "categories"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_garbage" ADD CONSTRAINT "areas_garbage_garbage_id_fkey" FOREIGN KEY ("garbage_id") REFERENCES "garbage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas_garbage" ADD CONSTRAINT "areas_garbage_area_code_fkey" FOREIGN KEY ("area_code") REFERENCES "areas"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garbage_registrations" ADD CONSTRAINT "garbage_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garbage_registration_details" ADD CONSTRAINT "garbage_registration_details_registration_id_fkey" FOREIGN KEY ("registration_id") REFERENCES "garbage_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garbage_registration_details" ADD CONSTRAINT "garbage_registration_details_garbage_id_fkey" FOREIGN KEY ("garbage_id") REFERENCES "garbage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "garbage_collection_schedules" ADD CONSTRAINT "garbage_collection_schedules_area_code_fkey" FOREIGN KEY ("area_code") REFERENCES "areas"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms_users" ADD CONSTRAINT "chat_rooms_users_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "chat_rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_rooms_users" ADD CONSTRAINT "chat_rooms_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
