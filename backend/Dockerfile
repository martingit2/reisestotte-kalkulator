# Steg 1: Bygg applikasjonen med Maven
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Optimaliser Docker's layer caching ved å laste ned dependencies først
COPY pom.xml .
RUN mvn dependency:go-offline

# Kopier resten av kildekoden og bygg
COPY src ./src
RUN mvn clean package -DskipTests

# Steg 2: Lag et minimalt produksjonsimage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Kopier kun den kompilerte .jar-filen fra byggesteget
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]