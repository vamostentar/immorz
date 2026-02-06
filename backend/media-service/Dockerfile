FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache vips-dev build-base python3 make g++
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
COPY package.json yarn.lock* ./
RUN echo "nodeLinker: node-modules" > .yarnrc.yml && echo "enableTelemetry: false" >> .yarnrc.yml
ENV YARN_IGNORE_PATH=1
# Force sharp to use pre-built binaries and system libvips
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=0
ENV npm_config_sharp_binary_host="https://github.com/lovell/sharp-libvips/releases/download"
ENV npm_config_sharp_libvips_binary_host="https://github.com/lovell/sharp-libvips/releases/download"
RUN yarn --version && yarn install
COPY . .
RUN yarn build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN apk add --no-cache vips openssl curl libc6-compat
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
RUN mkdir -p /app/uploads && chown -R nodeuser:nodejs /app
USER nodeuser
EXPOSE 8083
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:8083/health || exit 1
CMD ["node", "dist/server.js"]

