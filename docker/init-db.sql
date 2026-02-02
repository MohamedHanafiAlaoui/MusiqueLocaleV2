-- Initialisation de la base de données pour MusiqueLocaleV2
-- Ce script est exécuté au démarrage du conteneur PostgreSQL

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vérifier que l'utilisateur musicuser existe et a les droits nécessaires
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'musicuser') THEN
        CREATE ROLE musicuser LOGIN PASSWORD 'musicpassword';
    END IF;
END
$$;

-- Donner les droits sur la base de données
GRANT ALL PRIVILEGES ON DATABASE musicstream TO musicuser;

-- S'assurer que le schéma public existe avec les bons droits
GRANT ALL ON SCHEMA public TO musicuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO musicuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO musicuser;

-- Configuration des droits par défaut pour les futures tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO musicuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO musicuser;

-- Message de confirmation
\echo 'Base de données MusiqueLocaleV2 initialisée avec succès'
