-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "messages"."MessageType" AS ENUM ('INBOUND', 'OUTBOUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "messages"."Message" ADD COLUMN IF NOT EXISTS "type" "messages"."MessageType" NOT NULL DEFAULT 'INBOUND';
