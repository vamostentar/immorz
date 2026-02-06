#!/bin/bash
set -e

echo "🚀 Starting notification-service..."

# Run migrations if DATABASE_URL is set
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Running Prisma migrations..."
  npx prisma migrate deploy || echo "⚠️ Migration failed or already up to date"
fi

# Drop privileges to nodeuser for security
echo "👤 Switching to nodeuser..."
exec su-exec nodeuser "$@"
