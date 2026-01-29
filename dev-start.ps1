# ====================================
# Ribeira Azul - Development Environment Startup (PowerShell)
# ====================================
# Script para iniciar o ambiente de desenvolvimento no Windows

Write-Host "🚀 Iniciando Ribeira Azul - Ambiente de Desenvolvimento" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se existe docker-compose.override.yml
if (-Not (Test-Path "docker-compose.override.yml")) {
    Write-Host "⚠️  docker-compose.override.yml não encontrado!" -ForegroundColor Yellow
    Write-Host "📋 Criando a partir do template..." -ForegroundColor Yellow
    Copy-Item "docker-compose.override.yml.example" "docker-compose.override.yml"
    Write-Host "✅ docker-compose.override.yml criado!" -ForegroundColor Green
    Write-Host ""
}

# Verificar se existe .env
if (-Not (Test-Path ".env")) {
    Write-Host "⚠️  .env não encontrado!" -ForegroundColor Yellow
    $response = Read-Host "📋 Deseja usar .env.development como base? (y/n)"
    if ($response -match '^[Yy]$') {
        Copy-Item ".env.development" ".env"
        Write-Host "✅ .env criado a partir de .env.development!" -ForegroundColor Green
        Write-Host "⚠️  IMPORTANTE: Revise o arquivo .env e ajuste as variáveis se necessário" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Por favor, crie um arquivo .env antes de continuar" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

Write-Host "🔧 Configurações:" -ForegroundColor Cyan
Write-Host "  - Ambiente: DESENVOLVIMENTO"
Write-Host "  - Docker Compose: docker-compose.yaml + docker-compose.override.yml"
Write-Host "  - Portas expostas:"
Write-Host "    • Frontend: http://localhost:3000"
Write-Host "    • API Gateway: http://localhost:8081"
Write-Host "    • PostgreSQL: localhost:5432"
Write-Host "    • Redis: localhost:6379"
Write-Host "    • MinIO Console: http://localhost:9001"
Write-Host ""

# Perguntar se quer fazer rebuild
$rebuild = Read-Host "🛠️  Deseja fazer rebuild das imagens? (y/n)"
if ($rebuild -match '^[Yy]$') {
    Write-Host "🔨 Fazendo rebuild..." -ForegroundColor Yellow
    docker-compose build
    Write-Host "✅ Rebuild concluído!" -ForegroundColor Green
    Write-Host ""
}

Write-Host "🚢 Iniciando containers..." -ForegroundColor Cyan
docker-compose up -d

Write-Host ""
Write-Host "✅ Ambiente de desenvolvimento iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Verificar status dos containers:" -ForegroundColor Cyan
Write-Host "   docker-compose ps"
Write-Host ""
Write-Host "📝 Ver logs:" -ForegroundColor Cyan
Write-Host "   docker-compose logs -f"
Write-Host "   docker-compose logs -f [service-name]"
Write-Host ""
Write-Host "🛑 Para parar:" -ForegroundColor Cyan
Write-Host "   docker-compose down"
Write-Host ""
Write-Host "🌐 Acessos:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000"
Write-Host "   API Gateway: http://localhost:8081"
Write-Host "   MinIO Console: http://localhost:9001"
Write-Host ""
