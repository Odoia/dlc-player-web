# syntax=docker/dockerfile:1
# Build estatico (Vite) servido por nginx. Kaniko-friendly (pipeline in-cluster).
# A API fica baked no build (VITE_* e build-time). O poller nao passa build-arg,
# entao o valor vai aqui no ENV mesmo.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV VITE_API_URL=https://api-jogador.deliciouslabs.online
ENV VITE_APP_NAME="Portal do Jogador"
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
