# Etapa de construcción
FROM node:18-alpine AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS production

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Copiar archivos necesarios
COPY --chown=nestjs:nodejs package*.json ./

# Instalar solo dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Copiar build desde la etapa anterior
COPY --chown=nestjs:nodejs --from=builder /app/dist ./dist

# Cambiar a usuario no-root
USER nestjs

# Exponer puerto
EXPOSE 3000

# Usar dumb-init para manejo correcto de señales
ENTRYPOINT ["dumb-init", "--"]

# Comando de inicio
CMD ["node", "dist/main.js"]