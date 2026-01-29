# ====================================
# Ribeira Azul - Environment Verification Script
# ====================================
# Script para verificar se o ambiente está configurado corretamente

param(
    [switch]$Prod = $false
)

$ErrorActionPreference = "SilentlyContinue"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Ribeira Azul - Environment Verification         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($Prod) {
    Write-Host "🔍 Verificando configuração de PRODUÇÃO..." -ForegroundColor Red
}
else {
    Write-Host "🔍 Verificando configuração de DESENVOLVIMENTO..." -ForegroundColor Green
}
Write-Host ""

# Função para verificar com checkmark
function Test-Requirement {
    param(
        [string]$Name,
        [scriptblock]$Test,
        [string]$ErrorMessage,
        [bool]$Required = $true
    )
    
    Write-Host -NoNewline "  Verificando $Name... "
    
    if (& $Test) {
        Write-Host "✅" -ForegroundColor Green
        return $true
    }
    else {
        if ($Required) {
            Write-Host "❌" -ForegroundColor Red
            Write-Host "    $ErrorMessage" -ForegroundColor Yellow
            return $false
        }
        else {
            Write-Host "⚠️" -ForegroundColor Yellow
            Write-Host "    $ErrorMessage" -ForegroundColor Yellow
            return $true
        }
    }
}

$allOk = $true

# ====================================
# 1. Verificar Docker
# ====================================
Write-Host "📦 Docker:" -ForegroundColor Cyan
$dockerOk = Test-Requirement -Name "Docker instalado" -Test {
    (Get-Command docker -ErrorAction SilentlyContinue) -ne $null
} -ErrorMessage "Docker não encontrado. Instale Docker Desktop."

if ($dockerOk) {
    $dockerRunning = Test-Requirement -Name "Docker rodando" -Test {
        docker info *> $null
        $LASTEXITCODE -eq 0
    } -ErrorMessage "Docker não está rodando. Inicie Docker Desktop."
    $allOk = $allOk -and $dockerRunning
}

$dockerComposeOk = Test-Requirement -Name "Docker Compose" -Test {
    (Get-Command docker-compose -ErrorAction SilentlyContinue) -ne $null
} -ErrorMessage "Docker Compose não encontrado."
$allOk = $allOk -and $dockerOk -and $dockerComposeOk

Write-Host ""

# ====================================
# 2. Verificar Arquivos de Configuração
# ====================================
Write-Host "📁 Arquivos de Configuração:" -ForegroundColor Cyan

$envExists = Test-Requirement -Name ".env" -Test {
    Test-Path ".env"
} -ErrorMessage ".env não encontrado. Execute: cp .env.development .env"
$allOk = $allOk -and $envExists

Test-Requirement -Name "docker-compose.yaml" -Test {
    Test-Path "docker-compose.yaml"
} -ErrorMessage "docker-compose.yaml não encontrado."

if (-not $Prod) {
    Test-Requirement -Name "docker-compose.override.yml" -Test {
        Test-Path "docker-compose.override.yml"
    } -ErrorMessage "Override não encontrado. Execute: cp docker-compose.override.yml.example docker-compose.override.yml" -Required $false
}

Write-Host ""

# ====================================
# 3. Verificar Variáveis de Ambiente
# ====================================
if ($envExists) {
    Write-Host "🔐 Variáveis de Ambiente:" -ForegroundColor Cyan
    
    $envContent = Get-Content ".env" -Raw
    
    $requiredVars = @(
        "POSTGRES_USER",
        "POSTGRES_PASSWORD",
        "POSTGRES_DB",
        "REDIS_PASSWORD",
        "JWT_SECRET",
        "CORS_ORIGINS",
        "API_URL"
    )
    
    foreach ($var in $requiredVars) {
        $varExists = Test-Requirement -Name $var -Test {
            $envContent -match "$var=.+"
        } -ErrorMessage "$var não configurado no .env"
        $allOk = $allOk -and $varExists
    }
    
    # Verificar valores específicos para produção
    if ($Prod) {
        $nodeEnv = ($envContent | Select-String "NODE_ENV=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value })
        if ($nodeEnv -ne "production") {
            Write-Host "  ⚠️  NODE_ENV=$nodeEnv (esperado: production)" -ForegroundColor Yellow
        }
        
        $corsOrigin = ($envContent | Select-String "CORS_ORIGIN=(.+)" | ForEach-Object { $_.Matches.Groups[1].Value })
        if ($corsOrigin -match "localhost") {
            Write-Host "  ⚠️  CORS_ORIGIN contém 'localhost' em produção!" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

# ====================================
# 4. Verificar Containers (se rodando)
# ====================================
Write-Host "🐳 Containers:" -ForegroundColor Cyan

$containers = @("db", "redis", "minio", "auth", "properties", "users", "settings", "media", "messages", "api-gateway", "web")

$runningContainers = docker ps --format "{{.Names}}" 2>$null

if ($runningContainers) {
    foreach ($container in $containers) {
        $containerName = "ribeirazul-$container"
        $isRunning = $runningContainers -match $container
        
        if ($isRunning) {
            Write-Host "  ✅ $container" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  $container (não rodando)" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "  ℹ️  Nenhum container rodando" -ForegroundColor Yellow
}

Write-Host ""

# ====================================
# 5. Verificar Portas (se em dev)
# ====================================
if (-not $Prod) {
    Write-Host "🔌 Portas (Dev):" -ForegroundColor Cyan
    
    $ports = @{
        "3000" = "Frontend"
        "8081" = "API Gateway"
        "5432" = "PostgreSQL"
        "6379" = "Redis"
        "9000" = "MinIO API"
        "9001" = "MinIO Console"
    }
    
    foreach ($port in $ports.Keys) {
        $portInUse = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        
        if ($portInUse) {
            Write-Host "  ✅ :$port ($($ports[$port])) - Em uso" -ForegroundColor Green
        }
        else {
            Write-Host "  ⚠️  :$port ($($ports[$port])) - Livre" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
}

# ====================================
# 6. Verificar Conectividade
# ====================================
if ($runningContainers) {
    Write-Host "🌐 Conectividade:" -ForegroundColor Cyan
    
    # Testar Frontend
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ Frontend (http://localhost:3000)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ❌ Frontend não acessível" -ForegroundColor Red
    }
    
    # Testar API Gateway
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8081/health" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ API Gateway (http://localhost:8081)" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "  ❌ API Gateway não acessível" -ForegroundColor Red
    }
    
    Write-Host ""
}

# ====================================
# Resumo Final
# ====================================
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
if ($allOk) {
    Write-Host "║            ✅ Tudo OK!                            ║" -ForegroundColor Green
}
else {
    Write-Host "║        ⚠️  Alguns problemas encontrados           ║" -ForegroundColor Yellow
}
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($allOk -and -not $runningContainers) {
    Write-Host "💡 Para iniciar o ambiente:" -ForegroundColor Cyan
    if ($Prod) {
        Write-Host "   .\prod-start.ps1" -ForegroundColor White
    }
    else {
        Write-Host "   .\dev-start.ps1" -ForegroundColor White
        Write-Host "   ou: make dev" -ForegroundColor White
    }
    Write-Host ""
}

if ($runningContainers) {
    Write-Host "🌐 Acessos:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "   API Gateway: http://localhost:8081" -ForegroundColor White
    Write-Host "   MinIO Console: http://localhost:9001" -ForegroundColor White
    Write-Host ""
}

Write-Host "📚 Documentação:" -ForegroundColor Cyan
Write-Host "   Quick Start: QUICKSTART.md" -ForegroundColor White
Write-Host "   Setup Completo: DOCKER_SETUP.md" -ForegroundColor White
Write-Host "   Estratégia: DOCKER_STRATEGY.md" -ForegroundColor White
Write-Host ""
