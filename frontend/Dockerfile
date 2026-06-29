# stage 1: Build 
# pakai node.js alpine (versi ringan) untuk install depedency & compile project
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json (untuk caching layer saat install dependency)
COPY package*.json ./
RUN npm install

# Copy sisa source code setelah dependency terinstall
COPY . .

# Terima env var dari --build-arg (nanti dikirim oleh docker-compose dari file .env)
ARG VITE_API_URL
ARG VITE_API_BASE_URL
ARG VITE_APP_TITLE
ARG VITE_APP_DESCRIPTION
ARG VITE_NODE_ENV
ARG VITE_ENABLE_ANALYTICS
ARG VITE_ENABLE_DEBUG
ARG VITE_API_TIMEOUT

# Pindahkan ke ENV agar bisa dibaca oleh proses build (RUN npm run build)
ENV VITE_API_URL=${VITE_API_URL} \
    VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_APP_TITLE=${VITE_APP_TITLE} \
    VITE_APP_DESCRIPTION=${VITE_APP_DESCRIPTION} \
    VITE_NODE_ENV=${VITE_NODE_ENV} \
    VITE_ENABLE_ANALYTICS=${VITE_ENABLE_ANALYTICS} \
    VITE_ENABLE_DEBUG=${VITE_ENABLE_DEBUG} \
    VITE_API_TIMEOUT=${VITE_API_TIMEOUT}


# Compile project React/Vite jadi file statis (hasil ada di folder dist/)
RUN npm run build


# ---------- Stage 2: Serve ----------
# Pakai Nginx alpine untuk serve file hasil build
FROM nginx:alpine AS runner

# Pakai nginx.conf custom untuk SPA routing (fallback ke index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# mengambil hasil build dari stage sebelumnya
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"]