# 🎯 START HERE - Ribeira Azul Docker Environment

## ⚡ Quick Start

### Para Começar AGORA (3 passos):

1. **Setup Inicial**:
   ```powershell
   # Windows
   .\dev-start.ps1
   
   # Linux/Mac
   chmod +x dev-start.sh && ./dev-start.sh
   ```

2. **Aguarde** containers iniciarem (~30s)

3. **Acesse**: http://localhost:3000

## 📚 Documentação

| Arquivo | Quando Usar |
|---------|-------------|
| **[QUICKSTART.md](./QUICKSTART.md)** | 👈 Começar em 3 passos |
| [DOCKER_SETUP.md](./DOCKER_SETUP.md) | Guia completo |
| [DOCKER_STRATEGY.md](./DOCKER_STRATEGY.md) | Arquitetura e design |
| [SUMMARY.md](./SUMMARY.md) | Resumo executivo |
| [README.md](./README.md) | Info geral do projeto |

## 🛠️ Comandos Rápidos

```bash
# Com Make (Linux/Mac/WSL)
make dev          # Iniciar desenvolvimento
make prod         # Iniciar produção
make stop         # Parar
make logs         # Ver logs
make help         # Ver todos os comandos

# Windows (PowerShell)
.\dev-start.ps1   # Desenvolvimento
.\prod-start.ps1  # Produção
.\verify-env.ps1  # Verificar ambiente

# Docker Compose Manual
docker-compose up -d              # Dev (auto override)
docker-compose -f docker-compose.yaml up -d    # Prod (sem override)
```

## 🌐 Acessos Padrão

- **Frontend**: http://localhost:3000
- **API Gateway**: http://localhost:8081
- **MinIO Console**: http://localhost:9001 (minioadmin / minioadmin123)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🆘 Problemas?

1. Execute verificação: `.\verify-env.ps1`
2. Veja logs: `docker-compose logs -f`
3. Consulte [DOCKER_SETUP.md](./DOCKER_SETUP.md#troubleshooting)

---

✨ **Setup profissional implementado em 2025-12-02**
