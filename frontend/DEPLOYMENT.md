# Deployment Guide

## Requirements
- Docker installed
- Node.js 20+

## Environment Variables

Copy file `env.example` menjadi `.env` lalu isi nilainya:

```bash
cp env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | URL backend API | http://localhost:5001 |
| VITE_API_BASE_URL | Base URL API | http://localhost:5001/api |
| VITE_APP_TITLE | Judul aplikasi | Book Tracker App |
| VITE_NODE_ENV | Environment | production |

---

## Deploy dengan Docker

### 1. Build image
```bash
docker build -t book-app-frontend .
```

### 2. Run container
```bash
docker run -d -p 80:80 --name book-app-frontend book-app-frontend
```

### 3. Buka di browser
```text
http://localhost:80
```

---

## Deploy dengan Docker Compose
Jalankan dari folder `book-app/`:
```bash
docker compose up --build
```

Untuk stop container:
```bash
docker compose down
```