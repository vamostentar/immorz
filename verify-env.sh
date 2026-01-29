#!/bin/bash
# ====================================
# Ribeira Azul - Environment Verification Script
# ====================================
# Script para verificar se o ambiente está configurado corretamente

set +e

PROD=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prod|-p)
            PROD=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   Ribeira Azul - Environment Verification         ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$PROD" = true ]; then
    echo -e "${RED}🔍 Verificando configuração de PRODUÇÃO...${NC}"
else
    echo -e "${GREEN}🔍 Verificando configuração de DESENVOLVIMENTO...${NC}"
fi
echo ""

ALL_OK=true

# Função para verificar com checkmark
check_requirement() {
    local name=$1
    local test_command=$2
    local error_message=$3
    local required=${4:-true}
    
    echo -n "  Verificando $name... "
    
    if eval "$test_command" &>/dev/null; then
        echo -e "${GREEN}✅${NC}"
        return 0
    else
        if [ "$required" = true ]; then
            echo -e "${RED}❌${NC}"
            echo -e "    ${YELLOW}$error_message${NC}"
            ALL_OK=false
            return 1
        else
            echo -e "${YELLOW}⚠️${NC}"
            echo -e "    ${YELLOW}$error_message${NC}"
            return 0
        fi
    fi
}

# ====================================
# 1. Verificar Docker
# ====================================
echo -e "${CYAN}📦 Docker:${NC}"

check_requirement "Docker instalado" "command -v docker" "Docker não encontrado. Instale Docker."

if command -v docker &>/dev/null; then
    check_requirement "Docker rodando" "docker info" "Docker não está rodando. Inicie o Docker daemon."
fi

check_requirement "Docker Compose" "command -v docker-compose" "Docker Compose não encontrado."

echo ""

# ====================================
# 2. Verificar Arquivos de Configuração
# ====================================
echo -e "${CYAN}📁 Arquivos de Configuração:${NC}"

check_requirement ".env" "test -f .env" ".env não encontrado. Execute: cp .env.development .env"

check_requirement "docker-compose.yaml" "test -f docker-compose.yaml" "docker-compose.yaml não encontrado."

if [ "$PROD" = false ]; then
    check_requirement "docker-compose.override.yml" \
        "test -f docker-compose.override.yml" \
        "Override não encontrado. Execute: cp docker-compose.override.yml.example docker-compose.override.yml" \
        false
fi

echo ""

# ====================================
# 3. Verificar Variáveis de Ambiente
# ====================================
if [ -f ".env" ]; then
    echo -e "${CYAN}🔐 Variáveis de Ambiente:${NC}"
    
    required_vars=(
        "POSTGRES_USER"
        "POSTGRES_PASSWORD"
        "POSTGRES_DB"
        "REDIS_PASSWORD"
        "JWT_SECRET"
        "CORS_ORIGINS"
        "API_URL"
    )
    
    for var in "${required_vars[@]}"; do
        check_requirement "$var" \
            "grep -q \"^$var=.\\+\" .env" \
            "$var não configurado no .env"
    done
    
    # Verificar valores específicos para produção
    if [ "$PROD" = true ]; then
        node_env=$(grep "^NODE_ENV=" .env | cut -d'=' -f2)
        if [ "$node_env" != "production" ]; then
            echo -e "  ${YELLOW}⚠️  NODE_ENV=$node_env (esperado: production)${NC}"
        fi
        
        cors_origin=$(grep "^CORS_ORIGIN=" .env | cut -d'=' -f2)
        if echo "$cors_origin" | grep -q "localhost"; then
            echo -e "  ${YELLOW}⚠️  CORS_ORIGIN contém 'localhost' em produção!${NC}"
        fi
    fi
    
    echo ""
fi

# ====================================
# 4. Verificar Containers (se rodando)
# ====================================
echo -e "${CYAN}🐳 Containers:${NC}"

containers=("db" "redis" "minio" "auth" "properties" "users" "settings" "media" "messages" "api-gateway" "web")

if docker ps &>/dev/null; then
    running_containers=$(docker ps --format "{{.Names}}")
    
    if [ -n "$running_containers" ]; then
        for container in "${containers[@]}"; do
            if echo "$running_containers" | grep -q "$container"; then
                echo -e "  ${GREEN}✅ $container${NC}"
            else
                echo -e "  ${YELLOW}⚠️  $container (não rodando)${NC}"
            fi
        done
    else
        echo -e "  ${YELLOW}ℹ️  Nenhum container rodando${NC}"
    fi
else
    echo -e "  ${YELLOW}ℹ️  Não foi possível verificar containers${NC}"
fi

echo ""

# ====================================
# 5. Verificar Portas (se em dev)
# ====================================
if [ "$PROD" = false ]; then
    echo -e "${CYAN}🔌 Portas (Dev):${NC}"
    
    declare -A ports=(
        ["3000"]="Frontend"
        ["8081"]="API Gateway"
        ["5432"]="PostgreSQL"
        ["6379"]="Redis"
        ["9000"]="MinIO API"
        ["9001"]="MinIO Console"
    )
    
    for port in "${!ports[@]}"; do
        if command -v lsof &>/dev/null; then
            if lsof -i ":$port" &>/dev/null; then
                echo -e "  ${GREEN}✅ :$port (${ports[$port]}) - Em uso${NC}"
            else
                echo -e "  ${YELLOW}⚠️  :$port (${ports[$port]}) - Livre${NC}"
            fi
        elif command -v netstat &>/dev/null; then
            if netstat -an | grep -q ":$port "; then
                echo -e "  ${GREEN}✅ :$port (${ports[$port]}) - Em uso${NC}"
            else
                echo -e "  ${YELLOW}⚠️  :$port (${ports[$port]}) - Livre${NC}"
            fi
        fi
    done
    
    echo ""
fi

# ====================================
# 6. Verificar Conectividade
# ====================================
if [ -n "$running_containers" ]; then
    echo -e "${CYAN}🌐 Conectividade:${NC}"
    
    # Testar Frontend
    if curl -f -s "http://localhost:3000" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ Frontend (http://localhost:3000)${NC}"
    else
        echo -e "  ${RED}❌ Frontend não acessível${NC}"
    fi
    
    # Testar API Gateway
    if curl -f -s "http://localhost:8081/health" >/dev/null 2>&1; then
        echo -e "  ${GREEN}✅ API Gateway (http://localhost:8081)${NC}"
    else
        echo -e "  ${RED}❌ API Gateway não acessível${NC}"
    fi
    
    echo ""
fi

# ====================================
# Resumo Final
# ====================================
echo -e "${CYAN}╔════════════════════════════════════════════════════╗${NC}"
if [ "$ALL_OK" = true ]; then
    echo -e "${GREEN}║            ✅ Tudo OK!                            ║${NC}"
else
    echo -e "${YELLOW}║        ⚠️  Alguns problemas encontrados           ║${NC}"
fi
echo -e "${CYAN}╚════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$ALL_OK" = true ] && [ -z "$running_containers" ]; then
    echo -e "${CYAN}💡 Para iniciar o ambiente:${NC}"
    if [ "$PROD" = true ]; then
        echo -e "   ./prod-start.sh"
    else
        echo -e "   ./dev-start.sh"
        echo -e "   ou: make dev"
    fi
    echo ""
fi

if [ -n "$running_containers" ]; then
    echo -e "${CYAN}🌐 Acessos:${NC}"
    echo "   Frontend: http://localhost:3000"
    echo "   API Gateway: http://localhost:8081"
    echo "   MinIO Console: http://localhost:9001"
    echo ""
fi

echo -e "${CYAN}📚 Documentação:${NC}"
echo "   Quick Start: QUICKSTART.md"
echo "   Setup Completo: DOCKER_SETUP.md"
echo "   Estratégia: DOCKER_STRATEGY.md"
echo ""
