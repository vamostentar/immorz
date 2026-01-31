-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "MessageType" AS ENUM ('INBOUND', 'OUTBOUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "type" "MessageType" NOT NULL DEFAULT 'INBOUND';
