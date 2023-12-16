/*
  Warnings:

  - You are about to drop the column `dateDrom` on the `garbage_collection_schedules` table. All the data in the column will be lost.
  - Added the required column `message` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `chat_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateFrom` to the `garbage_collection_schedules` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RegistrationStatus" ADD VALUE 'Confirming';

-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "garbage_collection_schedules" DROP COLUMN "dateDrom",
ADD COLUMN     "dateFrom" DATE NOT NULL;

-- CreateTable
CREATE TABLE "user_settings" (
    "setting_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "data_type" "DataType" NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_settings_pkey" PRIMARY KEY ("setting_key")
);

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
