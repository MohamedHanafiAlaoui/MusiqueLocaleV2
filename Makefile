.PHONY: help build up down logs clean health dev prod

# Default target
help:
	@echo "🐳 MusiqueLocaleV2 Docker Commands"
	@echo ""
	@echo "Production:"
	@echo "  make build    - Build all Docker images (no node_modules copy)"
	@echo "  make up       - Start all services"
	@echo "  make down     - Stop all services"
	@echo "  make logs     - Show logs"
	@echo "  make health   - Check service health"
	@echo "  make clean    - Clean Docker resources"
	@echo ""
	@echo "Development:"
	@echo "  make dev      - Start development environment"
	@echo "  make dev-logs - Show development logs"
	@echo "  make dev-down - Stop development environment"
	@echo ""
	@echo "Utilities:"
	@echo "  make ps       - Show running containers"
	@echo "  make restart  - Restart all services"
	@echo ""
	@echo "📦 Note: node_modules are never copied to containers"
	@echo "   npm install runs inside containers only"

# Production commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

health:
	docker-compose ps

clean:
	docker-compose down -v
	docker system prune -f

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

dev-down:
	docker-compose -f docker-compose.dev.yml down

# Utilities
ps:
	docker-compose ps

restart:
	docker-compose restart

# Individual services
frontend:
	docker-compose up -d frontend

backend:
	docker-compose up -d backend

postgres:
	docker-compose up -d postgres

# Rebuild specific services
rebuild-frontend:
	docker-compose up --build frontend -d

rebuild-backend:
	docker-compose up --build backend -d

# Database operations
db-backup:
	docker-compose exec postgres pg_dump -U musicuser musicstream > backup_$(shell date +%Y%m%d_%H%M%S).sql

db-restore:
	@echo "Usage: make db-restore BACKUP_FILE=backup.sql"
	docker-compose exec -T postgres psql -U musicuser musicstream < $(BACKUP_FILE)

# Development with hot reload
dev-hot:
	docker-compose -f docker-compose.dev.yml up --build
