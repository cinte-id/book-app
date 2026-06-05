# Stage 1: Builder — compile React/Vite app into static assets
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
# npm ci is faster and reproducible vs npm install in CI/CD
RUN npm ci

COPY . .

# VITE_API_URL injected at build time so the SPA knows where to hit /api
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Runtime — nginx serves static files, no Node runtime needed
FROM nginx:alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html
# SPA routing: all paths fallback to index.html (react-router handles them)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
