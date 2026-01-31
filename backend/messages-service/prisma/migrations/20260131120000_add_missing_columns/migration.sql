-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "propertyId" TEXT,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;
