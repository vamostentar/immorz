-- MIGRATION MANUAL PARA MESSAGES SERVICE
-- Execute este script no console da base de dados (via Coolify ou pgAdmin)

-- 1. Criar o Enum MessageType se não existir
DO $$ BEGIN
    CREATE TYPE "MessageType" AS ENUM ('INBOUND', 'OUTBOUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Adicionar 'DELETED' ao Enum MessageStatus se não existir
ALTER TYPE "MessageStatus" ADD VALUE IF NOT EXISTS 'DELETED';

-- 3. Alterar a tabela Message para adicionar as colunas em falta
ALTER TABLE "Message" 
ADD COLUMN IF NOT EXISTS "type" "MessageType" NOT NULL DEFAULT 'INBOUND',
ADD COLUMN IF NOT EXISTS "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "propertyId" TEXT,
ADD COLUMN IF NOT EXISTS "agentId" TEXT;

-- 4. Verificar se a coluna conversationId é unique (caso já exista a tabela mas sem o indice)
-- (Opcional, apenas se der erro de constraint depois)
-- CREATE UNIQUE INDEX IF NOT EXISTS "Message_conversationId_key" ON "Message"("conversationId");

-- Confirmação
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Message';
