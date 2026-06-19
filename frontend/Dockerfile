# ============================================================
# Stage 1: Builder
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json bun.lockb ./
RUN npm ci

COPY . .

# Terima build args dari docker build / docker compose
ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_APP_TITLE
ARG VITE_APP_DESCRIPTION
ARG VITE_NODE_ENV
ARG VITE_ENABLE_ANALYTICS
ARG VITE_ENABLE_DEBUG
ARG VITE_ENABLE_MOCK_DATA
ARG VITE_API_TIMEOUT
ARG VITE_SHOW_DEV_TOOLS

# Jadikan ENV agar Vite bisa baca saat build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_APP_DESCRIPTION=$VITE_APP_DESCRIPTION
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS
ENV VITE_ENABLE_DEBUG=$VITE_ENABLE_DEBUG
ENV VITE_ENABLE_MOCK_DATA=$VITE_ENABLE_MOCK_DATA
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ENV VITE_SHOW_DEV_TOOLS=$VITE_SHOW_DEV_TOOLS 

RUN npm run build

# ============================================================
# Stage 2: Final — node alpine + serve
# ============================================================
FROM node:20-alpine AS final

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]