# 1. Bas-image med Java 17
FROM eclipse-temurin:17-jdk-alpine

# 2. Arbetskatalog i containern
WORKDIR /app

# 3. Kopiera jar-filen
COPY target/*.jar app.jar

# 4. Exponera port
EXPOSE 8080

# 5. Starta Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
 "-b"]