# ====================================
# Ribeira Azul - Production Environment Startup (PowerShell)
# ====================================
# Script para iniciar o ambiente de PRODUÇÃO (ignora overrides)

Write-Host "🚀 Iniciando Ribeira Azul - Ambiente de PRODUÇÃO" -ForegroundColor Red
Write-Host "==================================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  ATENÇÃO: Este script inicia o ambiente de PRODUÇÃO!" -ForegroundColor Yellow
Write-Host "   Todas as overrides de desenvolvimento serão IGNORADAS" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "Deseja continuar? (y/n)"
if ($continue -notmatch '^[Yy]$') {
    Write-Host "❌ Cancelado pelo usuário" -ForegroundColor Red
    exit 1
}

# Verificar se existe .env
if (-Not (Test-Path ".env")) {
    Write-Host "❌ Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "   Por favor, configure as variáveis de ambiente antes de continuar"
    exit 1
}

Write-Host ""
Write-Host "🔧 Configurações:" -ForegroundColor Cyan
Write-Host "  - Ambiente: PRODUÇÃO"
Write-Host "  - Docker Compose: docker-compose.yaml APENAS"
Write-Host "  - Overrides: IGNORADOS"
Write-Host ""

# Perguntar se quer fazer rebuild
$rebuild = Read-Host "🛠️  Deseja fazer rebuild das imagens? (y/n)"
if ($rebuild -match '^[Yy]$') {
    Write-Host "🔨 Fazendo rebuild para produção..." -ForegroundColor Yellow
    docker-compose -f docker-compose.yaml build
    Write-Host "✅ Rebuild concluído!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🚢 Iniciando containers em modo PRODUÇÃO..." -ForegroundColor Cyan
docker-compose -f docker-compose.yaml up -d

Write-Host ""
Write-Host "✅ Ambiente de PRODUÇÃO iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Verificar status:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.yaml ps"
Write-Host ""
Write-Host "📝 Ver logs:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.yaml logs -f"
Write-Host ""
Write-Host "🛑 Para parar:" -ForegroundColor Cyan
Write-Host "   docker-compose -f docker-compose.yaml down"
Write-Host ""
