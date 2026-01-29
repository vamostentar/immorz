# 🐳 Docker Environment Setup - Ribeira Azul

Este guia explica como rodar o projeto em **desenvolvimento** e **produção** usando Docker Compose.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração Inicial](#configuração-inicial)
- [Ambiente de Desenvolvimento](#ambiente-de-desenvolvimento)
- [Ambiente de Produção](#ambiente-de-produção)
- [Comandos Úteis](#comandos-úteis)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O projeto utiliza **Docker Compose Override Pattern** para gerenciar múltiplos ambientes:

| Arquivo | Propósito | Ambiente |
|---------|-----------|----------|
| `docker-compose.yaml` | Configuração base de **produção** | Produção |
| `docker-compose.dev.yml` | Override explícito para desenvolvimento | Dev (manual) |
| `docker-compose.override.yml` | Override **AUTOMÁTICO** para desenvolvimento | Dev (auto) |

### Como funciona?

- **Desenvolvimento**: `docker-compose up` → carrega `docker-compose.yaml` + `docker-compose.override.yml` automaticamente
- **Produção**: `docker-compose -f docker-compose.yaml up` → carrega **APENAS** `docker-compose.yaml`

---

## ⚙️ Configuração Inicial

### 1️⃣ Criar arquivo de environment

Você tem três opções:

#### Opção A: Usar template de desenvolvimento (Recomendado)
```bash
# Copiar template de desenvolvimento
cp .env.development .env

# Editar conforme necessário
nano .env  # ou use seu editor preferido
```

#### Opção B: Usar arquivo de produção existente
```bash
# Se já tem .env.production configurado
cp .env.production .env
```

#### Opção C: Criar do zero
```bash
# Usar exemplo como base
cp .env.example .env

# Editar todas as variáveis
nano .env
```

### 2️⃣ Criar arquivo de override (para desenvolvimento)

```bash
# Copiar template
cp docker-compose.override.yml.example docker-compose.override.yml

# Ajustar se necessário (opcional)
nano docker-compose.override.yml
```

> **📝 Nota**: O arquivo `docker-compose.override.yml` está no `.gitignore` para não interferir com produção

---

## 🚀 Ambiente de Desenvolvimento

### Método 1: Usando Script Automatizado (Recomendado)

#### No Windows (PowerShell):
```powershell
.\dev-start.ps1
```

#### No Linux/Mac:
```bash
chmod +x dev-start.sh
./dev-start.sh
```

### Método 2: Comandos Manuais

```bash
# 1. Criar override se não existir
cp docker-compose.override.yml.example docker-compose.override.yml

# 2. Criar .env se não existir
cp .env.development .env

# 3. Build das imagens (primeira vez)
docker-compose build

# 4. Iniciar containers
docker-compose up -d

# 5. Ver logs
docker-compose logs -f
```

### 🌐 Acessos em Desenvolvimento

| Serviço | URL | Notas |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Interface principal |
| **API Gateway** | http://localhost:8081 | Backend API |
| **PostgreSQL** | localhost:5432 | Database |
| **Redis** | localhost:6379 | Cache |
| **MinIO Console** | http://localhost:9001 | Object storage UI |
| **MinIO API** | http://localhost:9000 | S3-compatible API |

### 🔧 Configurações de Desenvolvimento

O `docker-compose.override.yml` sobrescreve:

- ✅ `NODE_ENV=development`
- ✅ `LOG_LEVEL=debug`
- ✅ Portas expostas para acesso externo
- ✅ CORS configurado para localhost
- ✅ Healthchecks mais frequentes (startup rápido)
- ✅ Hot reload (se configurado nos Dockerfiles)

---

## 🏭 Ambiente de Produção

### ⚠️ IMPORTANTE: Produção NÃO usa overrides

### Método 1: Usando Script Automatizado

#### No Windows (PowerShell):
```powershell
.\prod-start.ps1
```

#### No Linux/Mac:
```bash
chmod +x prod-start.sh
./prod-start.sh
```

### Método 2: Comandos Manuais

```bash
# 1. Garantir que .env está configurado para produção
# (verifique NODE_ENV, CORS_ORIGINS, API_URL, etc.)

# 2. Build das imagens
docker-compose -f docker-compose.yaml build

# 3. Iniciar containers (APENAS docker-compose.yaml)
docker-compose -f docker-compose.yaml up -d

# 4. Ver logs
docker-compose -f docker-compose.yaml logs -f
```

### 🔒 Configurações de Produção

O `docker-compose.yaml` contém:

- ✅ `NODE_ENV=production`
- ✅ `LOG_LEVEL=warn`
- ✅ Portas **NÃO** expostas (apenas rede interna)
- ✅ CORS configurado para domínios reais
- ✅ Healthchecks robustos
- ✅ Restart policies
- ✅ Labels do Coolify/Traefik

---

## 📚 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar
docker-compose up -d

# Parar
docker-compose down

# Rebuild
docker-compose build
docker-compose up -d --build

# Ver logs
docker-compose logs -f
docker-compose logs -f auth  # logs de um serviço específico

# Ver status
docker-compose ps

# Executar comando em container
docker-compose exec auth sh
docker-compose exec db psql -U ribeirazul -d ribeirazul_db

# Restart de um serviço
docker-compose restart auth

# Ver consumo de recursos
docker stats
```

### Produção

```bash
# Sempre usar -f docker-compose.yaml para produção!

# Iniciar
docker-compose -f docker-compose.yaml up -d

# Parar
docker-compose -f docker-compose.yaml down

# Rebuild
docker-compose -f docker-compose.yaml build
docker-compose -f docker-compose.yaml up -d --build

# Ver logs
docker-compose -f docker-compose.yaml logs -f

# Ver status
docker-compose -f docker-compose.yaml ps

# Executar comando
docker-compose -f docker-compose.yaml exec auth sh
```

### Limpeza

```bash
# Parar e remover tudo (CUIDADO!)
docker-compose down -v  # Remove volumes também!

# Remover imagens não utilizadas
docker image prune -a

# Remover volumes órfãos
docker volume prune

# Limpeza completa (CUIDADO!)
docker system prune -a --volumes
```

---

## 🐛 Troubleshooting

### Problema: CORS Error

**Sintoma**: Erros de CORS no navegador  
**Solução**:
```bash
# Verificar se CORS_ORIGINS está correto no .env
# Para dev: http://localhost:3000
# Para prod: https://seudominio.com

# Reiniciar serviços afetados
docker-compose restart auth properties users settings
```

### Problema: Container não inicia

**Sintoma**: Container fica reiniciando  
**Solução**:
```bash
# Ver logs do container
docker-compose logs -f [service-name]

# Ver detalhes do healthcheck
docker inspect [container-name]

# Verificar se dependências estão prontas
docker-compose ps
```

### Problema: Banco de dados não conecta

**Sintoma**: Erro de conexão com PostgreSQL  
**Solução**:
```bash
# Verificar se DB está healthy
docker-compose ps db

# Testar conexão manual
docker-compose exec db psql -U ribeirazul -d ribeirazul_db

# Verificar DATABASE_URL no .env
echo $DATABASE_URL
```

### Problema: Override não está funcionando

**Sintoma**: Mudanças no override não aparecem  
**Solução**:
```bash
# Verificar se override existe
ls -la docker-compose.override.yml

# Ver configuração final (merged)
docker-compose config

# Rebuild forçado
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Porta já está em uso

**Sintoma**: `Error: bind: address already in use`  
**Solução**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>

# Ou mudar a porta no docker-compose.override.yml
# Exemplo: "3001:80" ao invés de "3000:80"
```

---

## 📖 Recursos Adicionais

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Override Pattern](https://docs.docker.com/compose/extends/)
- [Environment Variables](https://docs.docker.com/compose/environment-variables/)

---

## 🤝 Contribuindo

Ao fazer mudanças:

1. **NUNCA** commitar `docker-compose.override.yml` (já está no `.gitignore`)
2. **SEMPRE** atualizar `docker-compose.override.yml.example` se necessário
3. **SEMPRE** testar em ambos ambientes (dev e prod)
4. **SEMPRE** atualizar este README se mudar configurações

---

## 📝 Checklist de Deploy

Antes de fazer deploy em produção:

- [ ] `.env` configurado com credenciais de produção
- [ ] `NODE_ENV=production` no `.env`
- [ ] `CORS_ORIGINS` apontando para domínio real
- [ ] `JWT_SECRET` forte e único
- [ ] Senhas de banco fortes
- [ ] SMTP configurado corretamente
- [ ] Volumes de dados configurados
- [ ] Backup strategy definida
- [ ] Testar com `docker-compose -f docker-compose.yaml config`

---

**Desenvolvido com ❤️ pela equipe Ribeira Azul**
