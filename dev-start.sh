#!/bin/bash
# ====================================
# Ribeira Azul - Development Environment Startup
# ====================================
# Script para iniciar o ambiente de desenvolvimento

set -e

echo "🚀 Iniciando Ribeira Azul - Ambiente de Desenvolvimento"
echo "=================================================="

# Verificar se existe docker-compose.override.yml
if [ ! -f "docker-compose.override.yml" ]; then
    echo "⚠️  docker-compose.override.yml não encontrado!"
    echo "📋 Criando a partir do template..."
    cp docker-compose.override.yml.example docker-compose.override.yml
    echo "✅ docker-compose.override.yml criado!"
    echo ""
fi

# Verificar se existe .env
if [ ! -f ".env" ]; then
    echo "⚠️  .env não encontrado!"
    echo "📋 Deseja usar .env.development como base? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        cp .env.development .env
        echo "✅ .env criado a partir de .env.development!"
        echo "⚠️  IMPORTANTE: Revise o arquivo .env e ajuste as variáveis se necessário"
    else
        echo "❌ Por favor, crie um arquivo .env antes de continuar"
        exit 1
    fi
    echo ""
fi

echo "🔧 Configurações:"
echo "  - Ambiente: DESENVOLVIMENTO"
echo "  - Docker Compose: docker-compose.yaml + docker-compose.override.yml"
echo "  - Portas expostas:"
echo "    • Frontend: http://localhost:3000"
echo "    • API Gateway: http://localhost:8081"
echo "    • PostgreSQL: localhost:5432"
echo "    • Redis: localhost:6379"
echo "    • MinIO Console: http://localhost:9001"
echo ""

# Perguntar se quer fazer rebuild
echo "🛠️  Deseja fazer rebuild das imagens? (y/n)"
read -r rebuild
if [[ "$rebuild" =~ ^[Yy]$ ]]; then
    echo "🔨 Fazendo rebuild..."
    docker-compose build
    echo "✅ Rebuild concluído!"
    echo ""
fi

echo "🚢 Iniciando containers..."
docker-compose up -d

echo ""
echo "✅ Ambiente de desenvolvimento iniciado com sucesso!"
echo ""
echo "📊 Verificar status dos containers:"
echo "   docker-compose ps"
echo ""
echo "📝 Ver logs:"
echo "   docker-compose logs -f"
echo "   docker-compose logs -f [service-name]"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose down"
echo ""
echo "🌐 Acessos:"
echo "   Frontend: http://localhost:3000"
echo "   API Gateway: http://localhost:8081"
echo "   MinIO Console: http://localhost:9001"
echo ""
