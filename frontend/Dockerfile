# Steg 1: Bygg React-applikasjonen
FROM node:18-alpine AS build
WORKDIR /app

# Bruk npm ci for deterministiske og raskere installasjoner i CI/CD-miljøer
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Steg 2: Server de statiske filene med en lettvekts Nginx-server
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Tøm standard Nginx-innhold
RUN rm -rf ./*

# Kopier de ferdigbygde filene fra forrige steg
COPY --from=build /app/dist .

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]