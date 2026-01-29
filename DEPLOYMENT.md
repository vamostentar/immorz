# 🚀 Ribeira Azul - Deployment Guide

Este guia fornece instruções para configurar e fazer o deploy da plataforma Ribeira Azul.

## 📋 Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git
- Domínio configurado (para produção)
- Servidor VPS ou plataforma de hosting (Coolify, Railway, etc.)

## ⚙️ Configuração Inicial

### 1. Clonar o Repositório

```bash
git clone https://github.com/vamostentar/immorz.git
cd immorz
```

### 2. Configurar Variáveis de Ambiente

**IMPORTANTE**: O projeto utiliza um único arquivo `.env` na raiz que injeta todas as variáveis nos microserviços via Docker Compose.

```bash
# Copiar o template
cp .env.example .env

# Editar com seus valores reais
nano .env  # ou use seu editor preferido
```

#### Variáveis Críticas (DEVE configurar):

| Variável               | Descrição               | Exemplo                           |
| ---------------------- | ----------------------- | --------------------------------- |
| `POSTGRES_PASSWORD`    | Senha do PostgreSQL     | `sua_senha_forte_123`             |
| `REDIS_PASSWORD`       | Senha do Redis          | `sua_senha_redis_456`             |
| `JWT_SECRET`           | Segredo para tokens JWT | `minimo_64_caracteres_aleatorios` |
| `MINIO_ROOT_PASSWORD`  | Senha do MinIO          | `senha_minio_segura_789`          |
| `S3_SECRET_ACCESS_KEY` | Chave secreta S3        | `chave_s3_segura`                 |

#### Email/SMTP (Auth Service):

```bash
AUTH_SMTP_USER=noreply@yourdomain.com
AUTH_SMTP_PASS=your_password
AUTH_EMAIL_FROM=noreply@yourdomain.com
```

#### Email/SMTP (Messages Service):

```bash
SMTP_USER=info@yourdomain.com
SMTP_PASS=your_password
EMAIL_FROM=info@yourdomain.com
```

#### CORS & API:

```bash
CORS_ORIGINS=https://www.yourdomain.com,https://yourdomain.com
API_URL=https://www.yourdomain.com
```

### 3. Gerar Senhas Seguras

Use ferramentas para gerar senhas fortes:

```bash
# Linux/Mac
openssl rand -base64 32

# PowerShell (Windows)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

## 🏗️ Estrutura de Microserviços

O projeto é composto por:

- **db** (PostgreSQL) - Base de dados principal
- **redis** - Cache e sessões
- **minio** - Armazenamento de objetos (imagens, documentos)
- **auth** - Autenticação e autorização (porta 8084)
- **properties** - Gestão de propriedades (porta 8082)
- **users** - Gestão de utilizadores (porta 8086)
- **settings** - Configurações do sistema (porta 8085)
- **media** - Upload e gestão de media (porta 8083)
- **messages** - Sistema de mensagens e emails (porta 8090)
- **api-gateway** - Gateway API unificado (porta 8081)
- **web** - Frontend (Nginx) (porta 80)

## 🚀 Deploy Local (Desenvolvimento)

```bash
# Build e start de todos os serviços
docker-compose up --build -d

# Verificar logs
docker-compose logs -f

# Verificar status
docker-compose ps

# Aceder à aplicação
http://localhost:3000
```

## 🌐 Deploy em Produção

### Opção 1: Coolify (Recomendado)

1. **Criar novo projeto no Coolify**
2. **Conectar repositório Git**
3. **Configurar variáveis de ambiente** via painel Coolify
4. **Selecionar `docker-compose.yaml`**
5. **Deploy automático**

Coolify gerirá automaticamente:

- SSL via Let's Encrypt
- Proxy reverso
- Health checks
- Rollback automático

### Opção 2: VPS Manual (one.com, DigitalOcean, etc.)

#### 1. Preparar o Servidor

```bash
# SSH no servidor
ssh user@your-server-ip

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose-plugin -y
```

#### 2. Clonar e Configurar

```bash
# Clonar repositório
git clone https://github.com/your-username/ribeirazul.git
cd ribeirazul

# Configurar .env (IMPORTANTE)
cp .env.example .env
nano .env  # Preencher com valores reais
```

#### 3. Deploy

```bash
# Build e start
docker-compose up -d --build

# Verificar status
docker-compose ps
docker-compose logs -f
```

#### 4. Configurar Nginx/Proxy Reverso (Opcional)

Se não estiver usando Coolify, configure um proxy reverso (Nginx, Traefik) para:

- SSL/TLS termination
- Routing do tráfego para o container `web`

## 🔐 Segurança

### Checklist de Segurança:

- [ ] Alterar **TODAS** as senhas default no `.env`
- [ ] Usar senhas com **mínimo 32 caracteres**
- [ ] Configurar **JWT_SECRET** com mínimo 64 caracteres
- [ ] Ativar **HTTPS/SSL** em produção
- [ ] Configurar **firewall** (apenas portas 80/443/22)
- [ ] Desativar **SWAGGER** em produção
- [ ] Configurar **backups** regulares da base de dados
- [ ] Nunca commitar arquivos `.env` ao Git

## 📊 Monitorização e Logs

```bash
# Ver logs de um serviço específico
docker-compose logs -f auth

# Ver logs de todos os serviços
docker-compose logs -f

# Ver apenas últimas 100 linhas
docker-compose logs --tail=100

# Verificar health de todos os containers
docker-compose ps
```

## 🔄 Atualizações

```bash
# Pull das alterações
git pull origin main

# Rebuild e restart
docker-compose up -d --build

# Limpar imagens antigas
docker image prune -a
```

## 🛠️ Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs nome-do-servico

# Verificar configuração
docker-compose config

# Restart de um serviço específico
docker-compose restart nome-do-servico
```

### Erro de conexão à base de dados

```bash
# Verificar se PostgreSQL está healthy
docker-compose ps db

# Ver logs do PostgreSQL
docker-compose logs db

# Verificar variáveis de ambiente
docker-compose exec auth env | grep DATABASE
```

### Problemas com permissões de volumes

```bash
# Dar ownership correto
sudo chown -R 999:999 volumes/db_data
sudo chown -R 1000:1000 volumes/minio_data
```

## 📞 Suporte

Para questões ou problemas, contactar:

- Email: support@immorz.pt
- GitHub Issues: https://github.com/your-username/ribeirazul/issues

---

**Última atualização**: 2026-01-29
