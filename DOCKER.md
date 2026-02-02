# 🐳 Docker - MusiqueLocaleV2

Guide complet pour déployer MusiqueLocaleV2 avec Docker et Docker Compose.

## 📋 Prérequis

- Docker 20.10+
- Docker Compose 2.0+
- Make (optionnel, pour les commandes rapides)
- 4GB+ RAM recommandé

## 🚀 Démarrage rapide

### 1. Cloner et préparer
```bash
git clone <repository-url>
cd music
```

### 2. Environnement de développement
```bash
# Démarrer tous les services
make up

# Ou avec docker-compose directement
docker-compose up -d

# Vérifier l'état
make health
```

### 3. Environnement de production
```bash
# Copier les variables d'environnement
cp .env.example .env
# Éditer .env avec vos valeurs sécurisées

# Démarrer en mode production
make prod
```

## 🏗️ Architecture Docker

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   PostgreSQL    │
│   (Nginx)       │◄──►│  (Spring Boot)  │◄──►│   Database      │
│   Port: 80      │    │   Port: 8080    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Volumes       │
                    │   - Uploads     │
                    │   - Database    │
                    └─────────────────┘
```

## 📦 Services disponibles

| Service | Port | Description | Health Check |
|---------|------|-------------|--------------|
| Frontend | 80 | Application Angular avec Nginx | `/health` |
| Backend | 8080 | API Spring Boot | `/actuator/health` |
| PostgreSQL | 5432 | Base de données PostgreSQL | `pg_isready` |
| pgAdmin | 5050 | Interface d'admin BDD (optionnel) | - |

## 🛠️ Commandes utiles

### Makefile (recommandé)
```bash
# Aide
make help

# Construction
make build              # Builder toutes les images
make build-no-cache     # Builder sans cache

# Gestion des services
make up                 # Démarrer tous les services
make down               # Arrêter tous les services
make restart            # Redémarrer les services

# Environnements
make dev                # Environnement de développement
make prod               # Environnement de production

# Logs et monitoring
make logs               # Voir tous les logs
make logs-backend       # Logs du backend
make logs-frontend      # Logs du frontend
make health             # Vérifier l'état de santé
make info               # Informations système

# Maintenance
make clean              # Nettoyer tout (conteneurs + images + volumes)
make clean-data         # Nettoyer uniquement les données
make update             # Mettre à jour les images

# Tests
make test               # Exécuter tous les tests

# Base de données
make shell-postgres     # Shell PostgreSQL
make backup             # Sauvegarder la BDD
make restore FILE=backup.sql  # Restaurer la BDD

# Développement
make shell-backend      # Shell dans le conteneur backend
```

### Docker Compose direct
```bash
# Construction
docker-compose build
docker-compose build --no-cache

# Gestion des services
docker-compose up -d
docker-compose down
docker-compose restart

# Logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# État
docker-compose ps
docker-compose top
```

## 🔧 Configuration

### Variables d'environnement

Copiez `.env.example` en `.env` et adaptez :

```bash
# Sécurité
POSTGRES_PASSWORD=votre_mot_de_passe_securise

# SSL (optionnel)
SSL_CERT_PATH=./docker/ssl/cert.pem
SSL_KEY_PATH=./docker/ssl/key.pem

# Domaine (optionnel)
DOMAIN=monsite.com
EMAIL=admin@monsite.com
```

### Volumes persistants

- `postgres_data` : Données PostgreSQL
- `music_uploads` : Fichiers audio uploadés
- `pgadmin_data` : Configuration pgAdmin (optionnel)

### Réseaux

- `musique-network` : Réseau isolé pour les services
- `musique-dev-network` : Réseau de développement
- `musique-prod-network` : Réseau de production

## 🌍 Environnements

### Développement (`docker-compose.dev.yml`)
```yaml
# Caractéristiques :
- Hot reload avec volumes montés
- Logs détaillés (SQL activé)
- Base de données recréée à chaque démarrage
- Build rapide
```

```bash
make dev
# Accès :
# Frontend: http://localhost:80
# Backend: http://localhost:8080
# PostgreSQL: localhost:5432
```

### Production (`docker-compose.prod.yml`)
```yaml
# Caractéristiques :
- Optimisé pour la performance
- Limits mémoire définies
- Logs rotatifs
- Health checks avancés
- Support SSL (optionnel)
```

```bash
make prod
# Nécessite un fichier .env configuré
```

## 🔍 Monitoring et dépannage

### Health checks
```bash
# Vérifier l'état de tous les services
make health

# Health check manuel
curl http://localhost/health          # Frontend
curl http://localhost:8080/actuator/health  # Backend
docker-compose exec postgres pg_isready -U musicuser  # PostgreSQL
```

### Logs détaillés
```bash
# Tous les services
docker-compose logs -f --tail=100

# Service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Logs avec timestamps
docker-compose logs -f --timestamps
```

### Performance
```bash
# Utilisation des ressources
docker stats

# Informations détaillées
make info
```

### Problèmes courants

#### Port déjà utilisé
```bash
# Vérifier les ports utilisés
netstat -tulpn | grep :8080
lsof -i :8080

# Solution : changer les ports dans docker-compose.yml
```

#### Permission denied
```bash
# Ajouter utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker

# Ou utiliser sudo
sudo docker-compose up -d
```

#### Mémoire insuffisante
```bash
# Augmenter la RAM Docker (Docker Desktop)
# Ou réduire les limites dans docker-compose.prod.yml
```

#### Reconstruction complète
```bash
# Arrêter et supprimer tout
docker-compose down -v --rmi all

# Nettoyer le système
docker system prune -a

# Reconstruire
docker-compose build --no-cache
docker-compose up -d
```

## 🗄️ Gestion de la base de données

### Connexion
```bash
# Shell PostgreSQL
make shell-postgres

# Connexion directe
docker-compose exec postgres psql -U musicuser -d musicstream

# Avec pgAdmin
# URL: http://localhost:5050
# Email: admin@musiquelocale.com
# Password: admin123
```

### Sauvegarde
```bash
# Sauvegarde automatique
make backup

# Sauvegarde manuelle
docker-compose exec postgres pg_dump -U musicuser musicstream > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauration
```bash
# Avec Makefile
make restore FILE=backup.sql

# Manuellement
docker-compose exec -T postgres psql -U musicuser musicstream < backup.sql
```

### Migration
```bash
# Pour les changements de schéma
# Hibernate DDL auto gère les migrations en développement
# En production, utiliser Flyway ou Liquibase
```

## 📊 Performance et optimisation

### Nginx (Frontend)
- Gzip compression activée
- Cache statique (1 an)
- Security headers configurés
- Proxy API intégré

### Spring Boot (Backend)
- Connection pooling HikariCP
- Health checks Actuator
- Logs structurés
- Mémoire optimisée

### PostgreSQL
- Configuration optimisée
- Index automatiques
- Connection pooling

## 🔒 Sécurité

### Configuration
- Utilisateurs non-root dans les conteneurs
- Réseaux isolés
- Variables d'environnement sécurisées
- Secrets externes recommandés

### Bonnes pratiques
```bash
# Scanner les images
docker scan musique-backend
docker scan musique-frontend

# Mettre à jour régulièrement
make update

# Utiliser des images officielles
# Vérifier les vulnérabilités
docker-compose exec backend curl -s http://localhost:8080/actuator/health
```

## 🚀 Déploiement en production

### 1. Préparation
```bash
# Configuration de production
cp .env.example .env
# Éditer .env avec vos valeurs

# Build production
make build
```

### 2. Déploiement
```bash
# Déploiement production
make prod

# Vérification
make health
```

### 3. Monitoring
```bash
# Logs en continu
make logs

# Surveillance
docker-compose exec backend curl -s http://localhost:8080/actuator/metrics
```

### 4. Maintenance
```bash
# Sauvegardes régulières
make backup

# Mises à jour
make update

# Nettoyage
docker system prune -f
```

## 📝 Scripts personnalisés

### Backup automatique
```bash
#!/bin/bash
# backup-automatique.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
mkdir -p $BACKUP_DIR

docker-compose exec postgres pg_dump -U musicuser musicstream > $BACKUP_DIR/backup_$DATE.sql

# Nettoyer les anciennes sauvegardes (7 jours)
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

### Monitoring avancé
```bash
#!/bin/bash
# monitor.sh
echo "=== État des services ==="
docker-compose ps

echo "=== Utilisation mémoire ==="
docker stats --no-stream

echo "=== Health checks ==="
curl -s http://localhost/health && echo "✓ Frontend OK" || echo "✗ Frontend ERROR"
curl -s http://localhost:8080/actuator/health && echo "✓ Backend OK" || echo "✗ Backend ERROR"
```

---

Pour plus d'informations, consultez la documentation principale du projet.
