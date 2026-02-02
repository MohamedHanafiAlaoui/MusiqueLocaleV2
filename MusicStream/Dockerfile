# Multi-stage build for Spring Boot application
# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-17 AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Runtime with OpenJDK
FROM eclipse-temurin:17-jre-alpine

# Install required utilities
RUN apk add --no-cache curl

# Create application directory
WORKDIR /app

# Create uploads directory
RUN mkdir -p /app/uploads/music && \
    chmod 755 /app/uploads/music

# Copy JAR from builder stage
COPY --from=builder /app/target/*.war app.jar

# Create non-root user for security
RUN addgroup -g 1000 appuser && adduser -D -s /bin/sh -u 1000 -G appuser appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8080

# Environment variables
ENV SPRING_PROFILES_ACTIVE=docker
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/musicstream
ENV SPRING_DATASOURCE_USERNAME=musicuser
ENV SPRING_DATASOURCE_PASSWORD=musicpassword
ENV SERVER_PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Start application
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/app/app.jar"]
