############################
# Builder
############################
FROM node:22-alpine AS builder

WORKDIR /app

# Dependências de build
RUN apk add --no-cache \
    build-base \
    python3 \
    make \
    g++

# Yarn Berry via Corepack
RUN corepack enable && corepack prepare yarn@4.9.2 --activate

# Copiar manifestos
COPY package.json yarn.lock* ./

# Forçar nodeLinker node-modules para compat com Docker
RUN echo "nodeLinker: node-modules" > .yarnrc.yml && \
    echo "enableTelemetry: false" >> .yarnrc.yml

# Instalar deps
RUN yarn install

# Copiar código
COPY . .

# Compilar TS
RUN yarn build

############################
# Runtime
############################
# Usamos a imagem oficial do Playwright para garantir que todos os drivers do browser estão presentes
FROM mcr.microsoft.com/playwright:v1.45.1-jammy AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Copiar artefactos do build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Instalar apenas os browsers necessários (para poupar espaço)
RUN npx playwright install chromium --with-deps

EXPOSE 8088

CMD ["node", "dist/server.js"]
