-- AlterTable
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "ownerId" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "agentId" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "createdBy" TEXT;
ALTER TABLE "properties" ADD COLUMN IF NOT EXISTS "updatedBy" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "properties_ownerId_idx" ON "properties"("ownerId");
CREATE INDEX IF NOT EXISTS "properties_agentId_idx" ON "properties"("agentId");
