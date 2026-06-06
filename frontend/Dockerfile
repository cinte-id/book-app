FROM node:20-alpine

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