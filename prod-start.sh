#!/bin/bash
# ====================================
# Ribeira Azul - Production Environment Startup
# ====================================
# Script para iniciar o ambiente de PRODUÇÃO (ignora overrides)

set -e

echo "🚀 Iniciando Ribeira Azul - Ambiente de PRODUÇÃO"
echo "=================================================="
echo ""
echo "⚠️  ATENÇÃO: Este script inicia o ambiente de PRODUÇÃO!"
echo "   Todas as overrides de desenvolvimento serão IGNORADAS"
echo ""
read -p "Deseja continuar? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelado pelo usuário"
    exit 1
fi

# Verificar se existe .env
if [ ! -f ".env" ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "   Por favor, configure as variáveis de ambiente antes de continuar"
    exit 1
fi

echo ""
echo "🔧 Configurações:"
echo "  - Ambiente: PRODUÇÃO"
echo "  - Docker Compose: docker-compose.yaml APENAS"
echo "  - Overrides: IGNORADOS"
echo ""

# Perguntar se quer fazer rebuild
read -p "🛠️  Deseja fazer rebuild das imagens? (y/n) " -r rebuild
echo ""
if [[ "$rebuild" =~ ^[Yy]$ ]]; then
    echo "🔨 Fazendo rebuild para produção..."
    docker-compose -f docker-compose.yaml build
    echo "✅ Rebuild concluído!"
    echo ""
fi

echo "🚢 Iniciando containers em modo PRODUÇÃO..."
docker-compose -f docker-compose.yaml up -d

echo ""
echo "✅ Ambiente de PRODUÇÃO iniciado com sucesso!"
echo ""
echo "📊 Verificar status:"
echo "   docker-compose -f docker-compose.yaml ps"
echo ""
echo "📝 Ver logs:"
echo "   docker-compose -f docker-compose.yaml logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose -f docker-compose.yaml down"
echo ""
