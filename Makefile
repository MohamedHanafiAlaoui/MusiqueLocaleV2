# Makefile pour MusiqueLocaleV2 Docker

.PHONY: help build up down logs clean dev prod test health

# Variables
COMPOSE_FILE = docker-compose.yml
DEV_COMPOSE_FILE = docker-compose.dev.yml
PROD_COMPOSE_FILE = docker-compose.prod.yml

# Couleurs
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

help: ## Afficher l'aide
	@echo "$(BLUE)MusiqueLocaleV2 - Commandes Docker disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

build: ## Builder toutes les images Docker
	@echo "$(YELLOW)Construction des images Docker...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build
	@echo "$(GREEN)Images construites avec succès!$(NC)"

build-no-cache: ## Builder les images sans cache
	@echo "$(YELLOW)Construction des images Docker sans cache...$(NC)"
	docker-compose -f $(COMPOSE_FILE) build --no-cache
	@echo "$(GREEN)Images construites avec succès!$(NC)"

up: ## Démarrer tous les services
	@echo "$(YELLOW)Démarrage des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Services démarrés!$(NC)"
	@make health

dev: ## Démarrer l'environnement de développement
	@echo "$(YELLOW)Démarrage de l'environnement de développement...$(NC)"
	docker-compose -f $(DEV_COMPOSE_FILE) up -d
	@echo "$(GREEN)Environnement de développement démarré!$(NC)"
	@echo "$(BLUE)Frontend: http://localhost:80$(NC)"
	@echo "$(BLUE)Backend: http://localhost:8080$(NC)"
	@echo "$(BLUE)PostgreSQL: localhost:5432$(NC)"

prod: ## Démarrer l'environnement de production
	@echo "$(YELLOW)Démarrage de l'environnement de production...$(NC)"
	docker-compose -f $(PROD_COMPOSE_FILE) --env-file .env up -d
	@echo "$(GREEN)Environnement de production démarré!$(NC)"

down: ## Arrêter tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	docker-compose -f $(COMPOSE_FILE) down
	@echo "$(GREEN)Services arrêtés!$(NC)"

down-dev: ## Arrêter l'environnement de développement
	@echo "$(YELLOW)Arrêt de l'environnement de développement...$(NC)"
	docker-compose -f $(DEV_COMPOSE_FILE) down
	@echo "$(GREEN)Environnement de développement arrêté!$(NC)"

down-prod: ## Arrêter l'environnement de production
	@echo "$(YELLOW)Arrêt de l'environnement de production...$(NC)"
	docker-compose -f $(PROD_COMPOSE_FILE) down
	@echo "$(GREEN)Environnement de production arrêté!$(NC)"

logs: ## Afficher les logs de tous les services
	docker-compose -f $(COMPOSE_FILE) logs -f

logs-backend: ## Afficher les logs du backend
	docker-compose -f $(COMPOSE_FILE) logs -f backend

logs-frontend: ## Afficher les logs du frontend
	docker-compose -f $(COMPOSE_FILE) logs -f frontend

logs-postgres: ## Afficher les logs de PostgreSQL
	docker-compose -f $(COMPOSE_FILE) logs -f postgres

clean: ## Nettoyer les conteneurs, images et volumes
	@echo "$(RED)Attention: Cette commande va supprimer tous les conteneurs, images et volumes Docker$(NC)"
	@read -p "Êtes-vous sûr? [y/N] " confirm && [ "$$confirm" = "y" ]
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all
	docker system prune -f
	@echo "$(GREEN)Nettoyage terminé!$(NC)"

clean-data: ## Nettoyer uniquement les volumes de données
	@echo "$(RED)Attention: Cette commande va supprimer toutes les données$(NC)"
	@read -p "Êtes-vous sûr? [y/N] " confirm && [ "$$confirm" = "y" ]
	docker-compose -f $(COMPOSE_FILE) down -v
	@echo "$(GREEN)Données supprimées!$(NC)"

health: ## Vérifier l'état de santé des services
	@echo "$(BLUE)Vérification de l'état des services...$(NC)"
	@docker-compose -f $(COMPOSE_FILE) ps
	@echo ""
	@echo "$(BLUE)Health Checks:$(NC)"
	@curl -s http://localhost:8080/actuator/health > /dev/null && echo "$(GREEN)✓ Backend: OK$(NC)" || echo "$(RED)✗ Backend: ERROR$(NC)"
	@curl -s http://localhost/health > /dev/null && echo "$(GREEN)✓ Frontend: OK$(NC)" || echo "$(RED)✗ Frontend: ERROR$(NC)"

test: ## Exécuter les tests dans les conteneurs
	@echo "$(YELLOW)Exécution des tests backend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec backend mvn test
	@echo "$(YELLOW)Exécution des tests frontend...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec frontend npm test -- --watch=false --browsers=ChromeHeadless

shell-backend: ## Ouvrir un shell dans le conteneur backend
	docker-compose -f $(COMPOSE_FILE) exec backend /bin/bash

shell-postgres: ## Ouvrir un shell PostgreSQL
	docker-compose -f $(COMPOSE_FILE) exec postgres psql -U musicuser -d musicstream

backup: ## Sauvegarder la base de données
	@echo "$(YELLOW)Sauvegarde de la base de données...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec postgres pg_dump -U musicuser musicstream > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Sauvegarde terminée!$(NC)"

restore: ## Restaurer la base de données (usage: make restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then echo "$(RED)Erreur: Veuillez spécifier le fichier de sauvegarde avec FILE=backup.sql$(NC)"; exit 1; fi
	@echo "$(YELLOW)Restauration de la base de données depuis $(FILE)...$(NC)"
	docker-compose -f $(COMPOSE_FILE) exec -T postgres psql -U musicuser musicstream < $(FILE)
	@echo "$(GREEN)Restauration terminée!$(NC)"

update: ## Mettre à jour les images et redémarrer
	@echo "$(YELLOW)Mise à jour des images...$(NC)"
	docker-compose -f $(COMPOSE_FILE) pull
	docker-compose -f $(COMPOSE_FILE) up -d
	@echo "$(GREEN)Mise à jour terminée!$(NC)"

info: ## Afficher les informations système
	@echo "$(BLUE)Informations Docker:$(NC)"
	@docker --version
	@docker-compose --version
	@echo ""
	@echo "$(BLUE)Utilisation des ressources:$(NC)"
	@docker stats --no-stream
