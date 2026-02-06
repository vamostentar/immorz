# Notification Service

Microserviço de notificações, aprovações e logs de auditoria para a plataforma Ribeirazul.

## 🎯 Funcionalidades

### 1. Notificações

- **In-App**: Notificações no painel do utilizador
- **Email**: Envio assíncrono via BullMQ + Nodemailer
- Tipos: Aprovações, mensagens, alertas de sistema
- Marcação de lidas/não lidas
- Contagem de não lidas

### 2. Aprovações

- Workflow centralizado: PENDING → APPROVED/REJECTED
- Entidades: Agentes, Imóveis, Documentos
- Revisão por admin com notas
- Histórico completo via audit logs

### 3. Audit Logs

- Registo de todas as ações críticas
- Rastreabilidade: quem, quando, o quê
- Filtros: utilizador, entidade, ação, data
- Integração com sistema de aprovações

## 🏗️ Arquitetura

```
notification-service:8087
├── API REST (Fastify)
├── PostgreSQL (schema: notifications)
├── Redis (BullMQ)
└── SMTP (via mensagens-service config)
```

### Stack Tecnológica

- **Framework**: Fastify 4.x
- **ORM**: Prisma 6.x
- **Queue**: BullMQ + Redis
- **Email**: Nodemailer
- **DI**: Awilix
- **Validation**: Zod

## 📡 Endpoints API

### Notificações

- `GET /api/v1/notifications` - Listar notificações
- `GET /api/v1/notifications/unread-count` - Contagem não lidas
- `PATCH /api/v1/notifications/:id/read` - Marcar como lida
- `PATCH /api/v1/notifications/read-all` - Marcar todas como lidas
- `DELETE /api/v1/notifications/:id` - Arquivar

### Aprovações

- `GET /api/v1/approvals` - Listar aprovações
- `GET /api/v1/approvals/pending` - Pendentes
- `GET /api/v1/approvals/stats` - Estatística
- `POST /api/v1/approvals` - Criar pedido
- `PATCH /api/v1/approvals/:id/approve` - Aprovar
- `PATCH /api/v1/approvals/:id/reject` - Rejeitar

### Audit Logs

- `GET /api/v1/audit-logs` - Listar logs
- `GET /api/v1/audit-logs/entity/:type/:id` - Logs por entidade
- `GET /api/v1/audit-logs/recent` - Atividade recente

## 🚀 Deployment

### 1. Variáveis de Ambiente

Todas as variáveis são injetadas via `.env` raiz:

```env
# Database (autogerenciado pelo docker-compose)
DATABASE_URL=postgresql://user:pass@db:5432/dbname?schema=notifications

# Redis (autogerenciado)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# SMTP (já configurado)
SMTP_HOST=${SMTP_HOST}
SMTP_USER=${SMTP_USER}
SMTP_PASS=${SMTP_PASS}
EMAIL_FROM=${EMAIL_FROM}

# JWT (já configurado)
JWT_SECRET=${JWT_SECRET}
```

### 2. Deploy Local (Dev)

```bash
# 1. Instalar dependências
cd backend/notification-service
yarn install

# 2. Gerar Prisma Client
yarn prisma:generate

# 3. Criar migração inicial
yarn prisma:migrate dev --name init

# 4. Iniciar em modo dev
yarn dev
```

### 3. Deploy Produção (Coolify)

O serviço já está integrado no `docker-compose.yaml`:

```bash
# Coolify irá automaticamente:
# 1. Build da imagem Docker
# 2. Executar migrações Prisma (via entrypoint)
# 3. Iniciar o serviço na porta 8087
# 4. Conectar ao api-gateway

# Para rebuild manual:
docker-compose up -d --build notifications
```

### 4. Verificação de Saúde

```bash
# Health check
curl http://notifications:8087/health

# Via api-gateway (produção)
curl https://immorz.pt/api/v1/notifications
```

## 📊 Modelos de Dados

### Notification

```prisma
model Notification {
  id          String
  userId      String
  type        NotificationType
  channel     NotificationChannel
  title       String
  message     String
  isRead      Boolean
  sentAt      DateTime?
  createdAt   DateTime
}
```

### Approval

```prisma
model Approval {
  id          String
  entityType  ApprovalEntity
  entityId    String
  status      ApprovalStatus
  reviewedBy  String?
  reviewedAt  DateTime?
  notes       String?
}
```

### AuditLog

```prisma
model AuditLog {
  id          String
  userId      String
  action      String
  entityType  String
  entityId    String
  changes     Json?
  ipAddress   String?
  createdAt   DateTime
}
```

## 🔌 Integração com Outros Serviços

### auth-service

- Notifica agente quando perfil é aprovado/rejeitado
- Cria entrada de aprovação quando novo agente regista

### properties-service

- Notifica agente quando imóvel é aprovado/rejeitado
- Cria entrada de aprovação quando novo imóvel é publicado

### messages-service

- Notifica destinatário quando nova mensagem é recebida
- Reutiliza configuração SMTP existente

## 🛠️ Development

```bash
# Type check
yarn type-check

# Lint
yarn lint

# Build
yarn build

# Prisma Studio (GUI)
npx prisma studio
```

## 📝 Próximos Passos

1. **Frontend**: Criar componentes React para:
   - Badge de notificações não lidas
   - Dropdown de notificações
   - Painel de aprovações para admin
   - Timeline de audit logs

2. **Integração**: Conectar serviços existentes para criar notifica ções automaticamente

3. **Email Templates**: Melhorar templates HTML para emails

4. **Push Notifications**: Adicionar suporte para notificações push (opcional)

## 👥 Autores

Ribeirazul Team  
Criado: 2026-02-04
