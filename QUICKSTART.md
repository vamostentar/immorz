# ⚡ Quick Start - Ribeira Azul Docker

## 🚀 Começar em 3 Passos

### 1️⃣ Setup Inicial (Apenas primeira vez)

#### Opção A: Usando Make (Linux/Mac/WSL)
```bash
make setup
```

#### Opção B: Usando Scripts

**Windows (PowerShell)**:
```powershell
.\dev-start.ps1
```

**Linux/Mac**:
```bash
chmod +x dev-start.sh
./dev-start.sh
```

#### Opção C: Manual
```bash
# Criar arquivos de configuração
cp .env.development .env
cp docker-compose.override.yml.example docker-compose.override.yml
```

---

### 2️⃣ Iniciar Ambiente de Desenvolvimento

#### Com Make:
```bash
make dev
```

#### Com Scripts:
```powershell
# Windows
.\dev-start.ps1

# Linux/Mac
./dev-start.sh
```

#### Manual:
```bash
docker-compose up -d
```

---

### 3️⃣ Acessar a Aplicação

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **API Gateway** | http://localhost:8081 |
| **MinIO Console** | http://localhost:9001 |

---

## 📊 Comandos Úteis

### Com Make

```bash
make help          # Ver todos os comandos
make dev           # Iniciar desenvolvimento
make stop          # Parar containers
make logs          # Ver logs
make status        # Ver status
make rebuild       # Rebuild completo
```

### Comandos Docker Compose

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Restart
docker-compose restart
```

---

## 🏭 Produção

### Iniciar Produção

```bash
# Com Make
make prod

# Com Script (Windows)
.\prod-start.ps1

# Com Script (Linux/Mac)
./prod-start.sh

# Manual
docker-compose -f docker-compose.yaml up -d
```

---

## 🆘 Problemas Comuns

### Porta já em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Container não inicia
```bash
# Ver logs
docker-compose logs -f [service-name]

# Rebuild
make rebuild
# ou
docker-compose down && docker-compose build --no-cache && docker-compose up -d
```

### CORS Error
```bash
# Verificar .env
cat .env | grep CORS

# Reiniciar serviços
docker-compose restart
```

---

## 📚 Documentação Completa

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Guia completo
- [DOCKER_STRATEGY.md](./DOCKER_STRATEGY.md) - Estratégia e arquitetura
- [README.md](./README.md) - Documentação do projeto

---

## ✅ Checklist

- [ ] `.env` criado
- [ ] `docker-compose.override.yml` criado
- [ ] `docker-compose up -d` executado
- [ ] Frontend acessível em http://localhost:3000
- [ ] API Gateway respondendo em http://localhost:8081

---

**Pronto! Você já pode começar a desenvolver! 🎉**
