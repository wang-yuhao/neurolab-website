# =============================================================
# frontend/Dockerfile — Multi-stage build
# Stages:
#   development  → Vite dev server with hot-reload
#   builder      → Production npm build
#   production   → nginx:alpine serving static files
# =============================================================

# ----------------------------------------------------------
# Stage 1: development (used by docker-compose.yml)
# ----------------------------------------------------------
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

# ----------------------------------------------------------
# Stage 2: builder — compile TypeScript + Vite bundle
# ----------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# VITE_API_URL is baked into the bundle at build time
ARG VITE_API_URL=https://synaping.com
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ----------------------------------------------------------
# Stage 3: production (used by docker-compose.prod.yml)
# Serves the compiled /app/dist with Nginx
# ----------------------------------------------------------
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
# SPA routing config (handles React Router client-side routes)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
