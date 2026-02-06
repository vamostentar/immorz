-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "messages"."MessageType" AS ENUM ('INBOUND', 'OUTBOUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "messages"."Message" ADD COLUMN IF NOT EXISTS "type" "messages"."MessageType" NOT NULL DEFAULT 'INBOUND';
ALTER TABLE "messages"."Message" ADD COLUMN IF NOT EXISTS "agentId" TEXT;
ALTER TABLE "messages"."Message" ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "messages"."Message" ADD COLUMN IF NOT EXISTS "propertyId" TEXT;
ALTER TABLE "messages"."Message" ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false;
