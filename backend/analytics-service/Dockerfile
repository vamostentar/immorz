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

# Copiar código e prisma schema
COPY . .

# Gerar Prisma Client
RUN yarn prisma:generate

# Compilar TS
RUN yarn build

############################
# Runtime
############################
FROM node:22-alpine AS runtime

ENV NODE_ENV=production
WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar artefactos do build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 8089

CMD ["node", "dist/server.js"]
