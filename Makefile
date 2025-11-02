.PHONY: help dev prod up down logs clean build restart shell db-shell

# Colores para output
GREEN  := \033[0;32m
YELLOW := \033[1;33m
NC     := \033[0m

help: ## Mostrar esta ayuda
	@echo "$(GREEN)Comandos disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

dev: ## Iniciar en modo desarrollo
	@echo "$(GREEN)Iniciando entorno de desarrollo...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ App: http://localhost:3000$(NC)"
	@echo "$(GREEN)✓ Mongo Express: http://localhost:8081 (admin/admin123)$(NC)"

prod: ## Iniciar en modo producción
	@echo "$(GREEN)Iniciando entorno de producción...$(NC)"
	docker-compose -f docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ App corriendo en modo producción$(NC)"

up: dev ## Alias de dev

down: ## Detener todos los contenedores
	@echo "$(YELLOW)Deteniendo contenedores...$(NC)"
	docker-compose down
	docker-compose -f docker-compose.prod.yml down

logs: ## Ver logs de la aplicación
	docker-compose logs -f app

logs-db: ## Ver logs de MongoDB
	docker-compose logs -f mongodb

clean: ## Limpiar contenedores, volúmenes e imágenes
	@echo "$(YELLOW)Limpiando entorno Docker...$(NC)"
	docker-compose down -v
	docker-compose -f docker-compose.prod.yml down -v
	docker system prune -f
	@echo "$(GREEN)✓ Limpieza completa$(NC)"

build: ## Reconstruir imágenes
	@echo "$(GREEN)Reconstruyendo imágenes...$(NC)"
	docker-compose build --no-cache

build-prod: ## Reconstruir imagen de producción
	@echo "$(GREEN)Reconstruyendo imagen de producción...$(NC)"
	docker-compose -f docker-compose.prod.yml build --no-cache

restart: ## Reiniciar servicios
	@echo "$(YELLOW)Reiniciando servicios...$(NC)"
	docker-compose restart

shell: ## Acceder al shell del contenedor de la app
	docker-compose exec app sh

db-shell: ## Acceder al shell de MongoDB
	docker-compose exec mongodb mongosh social_network_dev

backup: ## Crear backup de la base de datos
	@echo "$(GREEN)Creando backup...$(NC)"
	mkdir -p ./backups
	docker-compose exec mongodb mongodump --out=/backups/backup_$(shell date +%Y%m%d_%H%M%S)
	@echo "$(GREEN)✓ Backup creado en ./backups$(NC)"

restore: ## Restaurar último backup (uso: make restore BACKUP=backup_20241031_120000)
	@if [ -z "$(BACKUP)" ]; then \
		echo "$(YELLOW)Uso: make restore BACKUP=nombre_del_backup$(NC)"; \
		exit 1; \
	fi
	docker-compose exec mongodb mongorestore /backups/$(BACKUP)

install: ## Instalar dependencias localmente
	npm install

test: ## Ejecutar tests
	docker-compose exec app npm test

test-watch: ## Ejecutar tests en modo watch
	docker-compose exec app npm run test:watch

status: ## Mostrar estado de contenedores
	@echo "$(GREEN)Estado de los servicios:$(NC)"
	@docker-compose ps