# ------------------------------
# 🏗️ Etapa de construcción
# ------------------------------
    FROM node:18-alpine AS builder

    # Habilitar corepack (para usar pnpm sin instalarlo globalmente)
    RUN corepack enable
    
    # Directorio de trabajo
    WORKDIR /app
    
    # Copiar archivos necesarios
    COPY package.json pnpm-lock.yaml ./
    COPY tsconfig*.json ./
    
    # Instalar dependencias con pnpm (usa caché para acelerar builds)
    RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile
    
    # Copiar código fuente
    COPY src ./src
    
    # Construir la aplicación
    RUN pnpm run build
    
    
    # ------------------------------
    # 🧩 Etapa de producción
    # ------------------------------
    FROM node:18-alpine AS production
    
    RUN corepack enable
    RUN apk add --no-cache dumb-init
    
    # Crear usuario no-root
    RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
    
    WORKDIR /app
    
    # Copiar solo los archivos necesarios
    COPY --chown=nestjs:nodejs package.json pnpm-lock.yaml ./
    
    # Instalar dependencias de producción
    RUN --mount=type=cache,id=pnpm-prod,target=/root/.local/share/pnpm/store pnpm install --prod --frozen-lockfile && pnpm store prune
    
    # Copiar build desde la etapa anterior
    COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
    
    USER nestjs
    EXPOSE 3000
    
    ENTRYPOINT ["dumb-init", "--"]
    CMD ["pnpm", "start:prod"]
    