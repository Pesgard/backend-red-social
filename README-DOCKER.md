# 🐳 Configuración Docker - Red Social API

## 📋 Requisitos Previos

- Docker (versión 20.10 o superior)
- Docker Compose (versión 2.0 o superior)
- Make (opcional, para comandos simplificados)

## 🚀 Inicio Rápido

### 1. Clonar y configurar

```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd social-network-api

# Copiar archivo de configuración
cp .env.example .env

# Editar variables de entorno según necesidad
nano .env  # o usa tu editor preferido
```

### 2. Iniciar en modo desarrollo

**Con Make:**
```bash
make dev
```

**Sin Make:**
```bash
docker-compose up -d
```

### 3. Verificar que todo funciona

- **API:** http://localhost:3000
- **Mongo Express:** http://localhost:8081 (usuario: `admin`, password: `admin123`)
- **Health Check:** http://localhost:3000/health

## 📚 Comandos Disponibles

### Con Make (Recomendado)

```bash
make help          # Ver todos los comandos disponibles
make dev           # Iniciar en modo desarrollo
make prod          # Iniciar en modo producción
make down          # Detener todos los servicios
make logs          # Ver logs de la aplicación
make logs-db       # Ver logs de MongoDB
make clean         # Limpiar contenedores y volúmenes
make build         # Reconstruir imágenes
make restart       # Reiniciar servicios
make shell         # Acceder al shell de la app
make db-shell      # Acceder a MongoDB shell
make backup        # Crear backup de la base de datos
make test          # Ejecutar tests
make status        # Ver estado de servicios
```

### Sin Make

```bash
# Desarrollo
docker-compose up -d                    # Iniciar
docker-compose down                     # Detener
docker-compose logs -f app              # Ver logs
docker-compose exec app sh              # Shell de la app
docker-compose exec mongodb mongosh     # MongoDB shell

# Producción
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Configuración por Entorno

### Desarrollo (docker-compose.yml)

**Características:**
- Hot reload activado (cambios en código se reflejan automáticamente)
- Mongo Express incluido para administración visual
- Sin autenticación en MongoDB
- Volúmenes montados para desarrollo local

**Puertos expuestos:**
- `3000` - API NestJS
- `8081` - Mongo Express
- `27017` - MongoDB

### Producción (docker-compose.prod.yml)

**Características:**
- Build optimizado (multi-stage)
- MongoDB con autenticación
- Health checks configurados
- Sin hot reload
- Usuario no-root para seguridad

**Variables de entorno requeridas:**
```bash
JWT_SECRET=tu_clave_secreta_muy_segura
MONGO_ROOT_PASSWORD=password_seguro_mongodb
```

## 🗄️ Gestión de Base de Datos

### Acceder a MongoDB

```bash
# Con Make
make db-shell

# Sin Make
docker-compose exec mongodb mongosh social_network_dev
```

### Crear Backup

```bash
# Con Make
make backup

# Sin Make
docker-compose exec mongodb mongodump --out=/backups/backup_$(date +%Y%m%d_%H%M%S)
```

Los backups se guardan en `./backups/`

### Restaurar Backup

```bash
# Con Make
make restore BACKUP=backup_20241031_120000

# Sin Make
docker-compose exec mongodb mongorestore /backups/backup_20241031_120000
```

## 🔍 Debugging

### Ver logs en tiempo real

```bash
# Todos los servicios
docker-compose logs -f

# Solo la aplicación
docker-compose logs -f app

# Solo MongoDB
docker-compose logs -f mongodb
```

### Acceder al contenedor

```bash
# Shell de la aplicación
docker-compose exec app sh

# Ver archivos
docker-compose exec app ls -la /app

# Ver procesos
docker-compose exec app ps aux
```

### Problemas comunes

**Error: Puerto ya en uso**
```bash
# Ver qué proceso usa el puerto 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Cambiar puerto en .env
PORT=3001
```

**Error: Contenedor no inicia**
```bash
# Ver logs detallados
docker-compose logs app

# Reconstruir contenedor
docker-compose build --no-cache app
docker-compose up -d
```

**MongoDB no conecta**
```bash
# Verificar estado
docker-compose ps

# Reiniciar MongoDB
docker-compose restart mongodb

# Ver logs de MongoDB
docker-compose logs mongodb
```

## 🧪 Testing

```bash
# Ejecutar tests dentro del contenedor
make test

# Tests en modo watch
make test-watch

# Sin Make
docker-compose exec app npm test
```

## 🔐 Seguridad en Producción

### Checklist antes de deploy

- [ ] Cambiar `JWT_SECRET` por uno seguro (mínimo 32 caracteres)
- [ ] Configurar `MONGO_ROOT_PASSWORD` fuerte
- [ ] Actualizar credenciales de Mongo Express o deshabilitarlo
- [ ] Configurar CORS correctamente en `.env`
- [ ] Habilitar HTTPS/SSL en producción
- [ ] Configurar rate limiting apropiado
- [ ] Revisar logs y configurar rotación

### Generar JWT_SECRET seguro

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📊 Monitoreo

### Health Check

El endpoint `/health` verifica el estado de la aplicación:

```bash
curl http://localhost:3000/health
```

### Estado de contenedores

```bash
make status
# o
docker-compose ps
```

### Recursos utilizados

```bash
docker stats
```

## 🚢 Deployment

### Docker Hub

```bash
# Build y push
docker build -t tu-usuario/social-network-api:latest .
docker push tu-usuario/social-network-api:latest
```

### Servidor de producción

```bash
# En el servidor
git clone <tu-repo>
cd social-network-api

# Configurar variables
cp .env.example .env
nano .env  # Configurar para producción

# Iniciar
docker-compose -f docker-compose.prod.yml up -d

# Verificar
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

## 📝 Notas Adicionales

### Persistencia de datos

Los datos de MongoDB se persisten en volúmenes de Docker:
- Desarrollo: `mongodb_data_dev`
- Producción: `mongodb_data_prod`

Para eliminar todos los datos:
```bash
make clean  # ⚠️ Esto elimina los volúmenes
```

### Actualizaciones

```bash
# Actualizar código
git pull

# Reconstruir y reiniciar
make build
make restart
```

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs: `make logs`
2. Verifica el estado: `make status`
3. Consulta la documentación de NestJS: https://docs.nestjs.com
4. Revisa issues del repositorio