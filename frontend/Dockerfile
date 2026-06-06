# ===== STAGE 1: Builder =====
FROM node:20-alpine as builder

WORKDIR /app

# Copy dependency files
COPY package*.json bun.lockb ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# ===== STAGE 2: Runtime =====
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json bun.lockb ./
RUN npm install --production

# Copy built app from builder
COPY --from=builder /app/dist ./dist

# Expose port for Vite dev server
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Start development server
CMD ["npm", "run", "dev"]