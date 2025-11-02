# 🚀 Deployment Guide - Dokploy CI/CD

Este proyecto está configurado para hacer despliegue automático a Dokploy cuando se hace push a la rama `master`.

## 📋 Requisitos Previos

1. **Cuenta en Dokploy** con acceso a la API
2. **Cuenta en Docker Hub** para almacenar las imágenes
3. **GitHub Repository** con acceso a Secrets

## 🔑 GitHub Secrets Necesarios

Configura los siguientes secrets en tu repositorio de GitHub (`Settings > Secrets and variables > Actions`):

### Docker Hub
- `DOCKHUB_USERNAME`: Tu usuario de Docker Hub
- `DOCKHUB_PASSWORD`: Tu token de acceso de Docker Hub

### Dokploy
- `DOKPLOY_URL`: URL de tu instancia de Dokploy (ej: `https://dokploy.tudominio.com/api`)
- `DOKPLOY_API_KEY`: Tu API Key de Dokploy

### Application Secrets
- `JWT_SECRET`: Secret para JWT (genera uno seguro)
- `CORS_ORIGIN`: Origen permitido para CORS (ej: `https://tuapp.com` o `*` para desarrollo)
- `MONGO_PASSWORD`: Contraseña para MongoDB

## 🏗️ Arquitectura del Deployment

### Componentes que se crean automáticamente:

1. **Proyecto en Dokploy**: `redsocialgera`
   - Variables de entorno globales del proyecto
   
2. **Environment**: `production`
   - Entorno de producción

3. **MongoDB Service**: `redsocialgera-mongodb`
   - Base de datos MongoDB 7.0
   - Puerto interno: 27017
   - Database: `social_network_prod`
   - Usuario: `admin`

4. **Backend Application**: `redsocialgera-backend`
   - NestJS API
   - Puerto: 3000
   - Source: Docker Hub
   - Recursos:
     - Memory: 512MB (limit) / 256MB (reservation)
     - CPU: 1 core (limit) / 0.5 core (reservation)

## 🔄 Flujo de Deployment

### Primera vez (Proyecto nuevo):
```
1. Detecta que no existe el proyecto
2. Crea proyecto "redsocialgera"
3. Crea environment "production"
4. Configura variables de entorno del proyecto
5. Crea MongoDB y lo despliega
6. Crea la aplicación Backend
7. Configura Docker provider con credenciales
8. Configura variables específicas del backend
9. Despliega el backend
```

### Deployments subsecuentes:
```
1. Detecta que el proyecto ya existe
2. Actualiza variables de entorno del proyecto
3. Verifica MongoDB (no lo recrea si existe)
4. Actualiza la imagen Docker del backend
5. Despliega la nueva versión del backend
```

## 🌍 Variables de Entorno

### A nivel Proyecto (heredadas por todos los servicios):
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=<desde secrets>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=<desde secrets>
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

### A nivel Backend (específicas):
```bash
MONGODB_URI=mongodb://redsocialgera-mongodb:27017/social_network_prod
```

## 🚦 Cómo usar

### Deployment Automático:
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin master
```

El workflow automáticamente:
- ✅ Construye la imagen Docker para múltiples arquitecturas (amd64, arm64)
- ✅ La sube a Docker Hub
- ✅ Crea/actualiza el proyecto en Dokploy
- ✅ Despliega el backend con la nueva imagen

### Verificar el deployment:
1. Ve a tu instancia de Dokploy
2. Navega a Proyectos > `redsocialgera`
3. Revisa los logs del backend deployment
4. Verifica el estado en el environment `production`

## 🐛 Troubleshooting

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo en Dokploy
- Revisa que el `MONGODB_URI` use el nombre correcto del servicio: `redsocialgera-mongodb`

### Error: "Docker authentication failed"
- Verifica tus credenciales de Docker Hub en GitHub Secrets
- Asegúrate de usar un Access Token, no tu contraseña

### Error: "Dokploy API Key invalid"
- Genera una nueva API Key en Dokploy
- Actualiza el secret `DOKPLOY_API_KEY` en GitHub

### El backend no inicia
- Revisa los logs en Dokploy
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate que la imagen Docker se construyó correctamente

## 📊 Monitoreo

### Ver logs del backend:
```bash
# En Dokploy, ve a:
Proyectos > redsocialgera > production > redsocialgera-backend > Logs
```

### Ver logs de MongoDB:
```bash
# En Dokploy, ve a:
Proyectos > redsocialgera > production > redsocialgera-mongodb > Logs
```

## 🔧 Configuración Manual (si es necesario)

Si necesitas hacer ajustes manuales:

1. **Dominio personalizado**: Agrega un dominio en Dokploy para el backend
2. **SSL/TLS**: Configura certificado Let's Encrypt
3. **Backups de MongoDB**: Configura backups automáticos
4. **Escalado**: Ajusta los recursos (CPU/Memory) según necesidad

## 📝 Notas Importantes

- ⚠️ El workflow solo se ejecuta en la rama `master`
- 🔒 Nunca commitees secrets al repositorio
- 🗄️ MongoDB NO se recrea en deployments subsecuentes (los datos persisten)
- 🐳 Cada deploy usa la etiqueta `:latest` y también `:commit-sha`
- ♻️ El cache de Docker Buildx mejora los tiempos de build

## 🎯 Próximos pasos

- [ ] Configurar dominio personalizado en Dokploy
- [ ] Agregar health checks más robustos
- [ ] Configurar backups automáticos de MongoDB
- [ ] Agregar staging environment
- [ ] Implementar blue-green deployments
