# Étape 1: Build avec Maven
FROM maven:3.9.4-openjdk-17-slim AS build

WORKDIR /app

# Copier le fichier pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Builder l'application
RUN mvn clean package -DskipTests

# Étape 2: Runtime avec OpenJDK
FROM openjdk:17-jre-slim

# Installer les utilitaires nécessaires
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Créer le répertoire de l'application
WORKDIR /app

# Créer le répertoire pour les uploads
RUN mkdir -p /app/uploads/music && \
    chmod 755 /app/uploads/music

# Copier le JAR de l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Créer un utilisateur non-root
RUN groupadd -r appuser && useradd -r -g appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Exposer le port
EXPOSE 8080

# Variables d'environnement par défaut
ENV SPRING_PROFILES_ACTIVE=docker
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/musicstream
ENV SPRING_DATASOURCE_USERNAME=musicuser
ENV SPRING_DATASOURCE_PASSWORD=musicpassword
ENV SERVER_PORT=8080

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/app/app.jar"]

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1
