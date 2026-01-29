# ====================================
# Ribeira Azul - Docker Makefile
# ====================================
# Comandos úteis para gerenciar ambientes Docker

.PHONY: help dev prod setup clean logs status rebuild

# Cores para output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Mostrar esta ajuda
	@echo "$(CYAN)╔════════════════════════════════════════╗$(NC)"
	@echo "$(CYAN)║   Ribeira Azul - Docker Commands      ║$(NC)"
	@echo "$(CYAN)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)Comandos disponíveis:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

setup: ## Setup inicial (cria .env e override.yml)
	@echo "$(CYAN)🔧 Setup inicial...$(NC)"
	@if [ ! -f .env ]; then \
		echo "$(YELLOW)Criando .env a partir de .env.development...$(NC)"; \
		cp .env.development .env; \
		echo "$(GREEN)✅ .env criado!$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  .env já existe$(NC)"; \
	fi
	@if [ ! -f docker-compose.override.yml ]; then \
		echo "$(YELLOW)Criando docker-compose.override.yml...$(NC)"; \
		cp docker-compose.override.yml.example docker-compose.override.yml; \
		echo "$(GREEN)✅ docker-compose.override.yml criado!$(NC)"; \
	else \
		echo "$(YELLOW)⚠️  docker-compose.override.yml já existe$(NC)"; \
	fi
	@echo "$(GREEN)✅ Setup concluído!$(NC)"

dev: ## Iniciar ambiente de DESENVOLVIMENTO
	@echo "$(CYAN)🚀 Iniciando ambiente de DESENVOLVIMENTO...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Ambiente iniciado!$(NC)"
	@echo "$(CYAN)🌐 Acessos:$(NC)"
	@echo "  • Frontend: http://localhost:3000"
	@echo "  • API Gateway: http://localhost:8081"
	@echo "  • MinIO Console: http://localhost:9001"

dev-build: ## Build + iniciar desenvolvimento
	@echo "$(CYAN)🔨 Build + iniciando DEV...$(NC)"
	@docker-compose build
	@docker-compose up -d
	@echo "$(GREEN)✅ Ambiente iniciado!$(NC)"

dev-logs: ## Ver logs do ambiente de desenvolvimento
	@docker-compose logs -f

prod: ## Iniciar ambiente de PRODUÇÃO
	@echo "$(RED)🏭 Iniciando ambiente de PRODUÇÃO...$(NC)"
	@echo "$(YELLOW)⚠️  ATENÇÃO: Usando configuração de produção!$(NC)"
	@docker-compose -f docker-compose.yaml up -d
	@echo "$(GREEN)✅ Ambiente de produção iniciado!$(NC)"

prod-build: ## Build + iniciar produção
	@echo "$(RED)🔨 Build + iniciando PROD...$(NC)"
	@docker-compose -f docker-compose.yaml build
	@docker-compose -f docker-compose.yaml up -d
	@echo "$(GREEN)✅ Ambiente de produção iniciado!$(NC)"

prod-logs: ## Ver logs do ambiente de produção
	@docker-compose -f docker-compose.yaml logs -f

stop: ## Parar containers (desenvolvimento)
	@echo "$(YELLOW)🛑 Parando containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Containers parados!$(NC)"

stop-prod: ## Parar containers (produção)
	@echo "$(RED)🛑 Parando containers de produção...$(NC)"
	@docker-compose -f docker-compose.yaml down
	@echo "$(GREEN)✅ Containers parados!$(NC)"

restart: ## Reiniciar containers (desenvolvimento)
	@echo "$(CYAN)🔄 Reiniciando containers...$(NC)"
	@docker-compose restart
	@echo "$(GREEN)✅ Containers reiniciados!$(NC)"

restart-prod: ## Reiniciar containers (produção)
	@echo "$(RED)🔄 Reiniciando containers de produção...$(NC)"
	@docker-compose -f docker-compose.yaml restart
	@echo "$(GREEN)✅ Containers reiniciados!$(NC)"

status: ## Ver status dos containers
	@echo "$(CYAN)📊 Status dos containers:$(NC)"
	@docker-compose ps

logs: ## Ver logs (desenvolvimento)
	@docker-compose logs -f

logs-auth: ## Ver logs do auth service
	@docker-compose logs -f auth

logs-api: ## Ver logs do API gateway
	@docker-compose logs -f api-gateway

logs-web: ## Ver logs do frontend
	@docker-compose logs -f web

logs-db: ## Ver logs do PostgreSQL
	@docker-compose logs -f db

rebuild: ## Rebuild completo (desenvolvimento)
	@echo "$(CYAN)🔨 Rebuild completo...$(NC)"
	@docker-compose down
	@docker-compose build --no-cache
	@docker-compose up -d
	@echo "$(GREEN)✅ Rebuild concluído!$(NC)"

rebuild-prod: ## Rebuild completo (produção)
	@echo "$(RED)🔨 Rebuild completo (PRODUÇÃO)...$(NC)"
	@docker-compose -f docker-compose.yaml down
	@docker-compose -f docker-compose.yaml build --no-cache
	@docker-compose -f docker-compose.yaml up -d
	@echo "$(GREEN)✅ Rebuild concluído!$(NC)"

clean: ## Limpar containers, volumes, e imagens
	@echo "$(RED)🧹 Limpando ambiente...$(NC)"
	@echo "$(YELLOW)⚠️  ATENÇÃO: Isso vai remover volumes (dados serão perdidos)!$(NC)"
	@read -p "Continuar? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker system prune -f; \
		echo "$(GREEN)✅ Limpeza concluída!$(NC)"; \
	else \
		echo "$(YELLOW)Cancelado$(NC)"; \
	fi

shell-auth: ## Shell no container auth
	@docker-compose exec auth sh

shell-api: ## Shell no container API gateway
	@docker-compose exec api-gateway sh

shell-db: ## Shell no PostgreSQL
	@docker-compose exec db psql -U ribeirazul -d ribeirazul_db

shell-redis: ## Shell no Redis
	@docker-compose exec redis redis-cli -a $$(grep REDIS_PASSWORD .env | cut -d '=' -f2)

config: ## Ver configuração final (merged)
	@echo "$(CYAN)📋 Configuração final (merged):$(NC)"
	@docker-compose config

config-prod: ## Ver configuração de produção
	@echo "$(RED)📋 Configuração de produção:$(NC)"
	@docker-compose -f docker-compose.yaml config

check-env: ## Verificar variáveis de ambiente
	@echo "$(CYAN)🔍 Verificando variáveis de ambiente...$(NC)"
	@echo "NODE_ENV: $$(docker-compose exec -T auth env | grep NODE_ENV || echo 'N/A')"
	@echo "CORS_ORIGIN: $$(docker-compose exec -T auth env | grep CORS_ORIGIN= || echo 'N/A')"
	@echo "API_URL: $$(docker-compose exec -T auth env | grep API_URL= || echo 'N/A')"
	@echo "LOG_LEVEL: $$(docker-compose exec -T auth env | grep LOG_LEVEL || echo 'N/A')"

stats: ## Ver estatísticas de recursos
	@docker stats --no-stream

prune: ## Remover recursos não utilizados
	@echo "$(YELLOW)🧹 Removendo recursos não utilizados...$(NC)"
	@docker system prune -f
	@echo "$(GREEN)✅ Concluído!$(NC)"

# Atalhos
up: dev ## Alias para 'dev'
down: stop ## Alias para 'stop'
ps: status ## Alias para 'status'
