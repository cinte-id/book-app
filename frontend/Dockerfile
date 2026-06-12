# ===== STAGE 1: Dependencies =====
FROM node:20-alpine AS deps

WORKDIR /app

# Copy dependency files
COPY package*.json bun.lockb ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# ===== STAGE 2: Builder =====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build production bundle
RUN npm run build

# ===== STAGE 3: Production (Nginx) =====
FROM nginx:1.27-alpine AS production

# Copy custom nginx config for SPA routing
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a minimal nginx config for SPA
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback — serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

# ===== STAGE 4: Development =====
# Use this target for docker-compose dev: build.target = "development"
FROM node:20-alpine AS development

WORKDIR /app

# Copy dependency files
COPY package*.json bun.lockb ./

# Install all dependencies (including devDependencies for dev server)
RUN npm install

# Copy application code
COPY . .

# Expose port for Vite dev server
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start development server
CMD ["npm", "run", "dev"]