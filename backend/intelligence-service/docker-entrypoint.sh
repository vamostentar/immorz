#!/bin/sh
set -e

echo "🚀 Intelligence Service entrypoint: waiting for dependencies..."

# Verificar se precisamos de instalar browsers do Playwright no runtime se não estiverem lá
# (Já fazemos no Dockerfile, mas isto garante consistência)
# npx playwright install chromium --with-deps

echo "✨ Starting Intelligence Service..."
exec "$@"
