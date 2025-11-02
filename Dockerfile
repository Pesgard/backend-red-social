# ------------------------------
# 🏗️ Etapa de construcción
# ------------------------------
    FROM node:18-alpine AS builder

    RUN corepack enable
    
    WORKDIR /app
    
    # Copiar archivos de dependencias
    COPY package.json pnpm-lock.yaml ./
    COPY tsconfig*.json ./
    
    # Instalar dependencias
    RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
        pnpm install --frozen-lockfile
    
    # Copiar código fuente
    COPY src ./src
    
    # Construir aplicación
    RUN pnpm run build
    
    # ------------------------------
    # 🧩 Etapa de producción
    # ------------------------------
    FROM node:18-alpine AS production
    
    RUN corepack enable
    
    # Instalar dependencias del sistema
    RUN apk add --no-cache \
        dumb-init \
        curl \
        wget
    
    # Crear usuario no-root
    RUN addgroup -g 1001 -S nodejs && \
        adduser -S nestjs -u 1001 -G nodejs
    
    WORKDIR /app
    
    # Copiar package.json para tener los scripts disponibles
    COPY --chown=nestjs:nodejs package.json pnpm-lock.yaml ./
    
    # Instalar solo dependencias de producción
    RUN --mount=type=cache,id=pnpm-prod,target=/root/.local/share/pnpm/store \
        pnpm install --prod --frozen-lockfile && \
        pnpm store prune
    
    # Copiar build desde la etapa anterior
    COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
    
    # Cambiar a usuario no-root
    USER nestjs
    
    EXPOSE 3000
    
    ENV NODE_ENV=production
    
    # Health check
    HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
        CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
    
    # Usar el script de package.json
    ENTRYPOINT ["/usr/bin/dumb-init", "--"]
    CMD ["pnpm", "start:prod"]