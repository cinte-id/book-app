# 📚 Book App — DevOps Runbook

## Architecture Overview

```
                        ┌─────────────────────────────────────────────┐
                        │              AWS EC2 (Ubuntu 22.04)          │
                        │                                              │
  User ──── HTTPS ────▶ │  Nginx (Port 80)                            │
                        │     │                                        │
                        │     ├──▶ Frontend (Port 5173)               │
                        │     │                                        │
                        │     └──▶ Backend Flask (Port 5001)          │
                        │               │                              │
                        │               └──▶ SQLite / books.json      │
                        │                                              │
                        │  ── Monitoring Stack ──────────────────────  │
                        │  Grafana (Port 3000)                        │
                        │     └──▶ Prometheus (Port 9090)             │
                        │               ├──▶ Flask /metrics           │
                        │               └──▶ Node Exporter (Port 9100)│
                        └─────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Python Flask |
| Reverse Proxy | Nginx |
| Container | Docker + Docker Compose |
| IaC | Terraform (AWS EC2 + Elastic IP + Security Group) |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana + Node Exporter |

---

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.0
- [AWS CLI](https://aws.amazon.com/cli/) sudah dikonfigurasi (`aws configure`)
- [Docker](https://docs.docker.com/get-docker/) & Docker Compose
- Git

---

## How to Deploy

### 1. Clone Repository

```bash
git clone https://github.com/EvoVincere/book-app.git
cd book-app
git checkout devops/container
```

### 2. Provision Infrastructure (Terraform)

```bash
cd terraform/

# Inisialisasi Terraform
terraform init

# Preview perubahan
terraform plan

# Apply (buat EC2, Elastic IP, Security Group)
terraform apply
```

Setelah selesai, catat output Elastic IP:
```
elastic_ip   = "x.x.x.x"
ssh_command  = "ssh -i ~/.ssh/book-app-key.pem ubuntu@x.x.x.x"
```

### 3. SSH ke EC2

```bash
ssh -i ~/.ssh/book-app-key.pem ubuntu@<ELASTIC_IP>
```

### 4. Clone Repo di EC2 & Jalankan App

```bash
# Di dalam EC2
git clone https://github.com/EvoVincere/book-app.git
cd book-app
git checkout devops/container

# SSH ke EC2

ssh -i ~/.ssh/book-app-key.pem ubuntu@<ELASTIC_IP>

# Setup Swap (Mencegah OOM) 

sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Jalankan semua service
docker-compose up -d
```

### 5. Verifikasi Semua Container Jalan

```bash
docker-compose ps
```

Semua status harus `Up` / `healthy`:
```
NAME                    STATUS
book-app-backend        Up (healthy)
book-app-frontend       Up (healthy)
book-app-nginx          Up
book-app-prometheus     Up
book-app-grafana        Up
book-app-node-exporter  Up
```

---

## How to Access Monitoring

### Grafana (Dashboard)

| Item | Value |
|---|---|
| URL | `http://<ELASTIC_IP>:3000` |
| Username | `admin` |
| Password | `admin123` |

**Import Dashboard Node Exporter (CPU, RAM, Disk, Network):**
1. Login ke Grafana
2. Klik **+** → **Import**
3. Masukkan ID: **`1860`**
4. Klik **Load** → pilih datasource **Prometheus** → **Import**

### Prometheus (Raw Metrics & Alerts)

| Item | Value |
|---|---|
| URL | `http://<ELASTIC_IP>:9090` |
| Targets | `http://<ELASTIC_IP>:9090/targets` |
| Alerts | `http://<ELASTIC_IP>:9090/alerts` |

**Cek semua target UP:**

Buka `http://<ELASTIC_IP>:9090/targets` — semua harus berstatus **UP**:
- `prometheus` (self)
- `node-exporter`
- `flask-backend`

**Contoh query Prometheus:**
```promql
# Total HTTP request ke Flask
flask_http_request_total

# CPU usage EC2
100 - (avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Memory usage EC2
(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100
```

### Alert Rules

Alert aktif di Prometheus mencakup:

| Alert | Kondisi | Severity |
|---|---|---|
| `FlaskBackendDown` | Backend tidak merespon > 1 menit | critical |
| `FlaskHighResponseTime` | Response time p90 > 1 detik | warning |
| `HighMemoryUsage` | RAM usage > 85% | warning |
| `HighCPUUsage` | CPU usage > 80% selama 2 menit | warning |

Cek status alert di: `http://<ELASTIC_IP>:9090/alerts`

---

## How to Roll Back

### Roll Back Aplikasi (ke commit sebelumnya)

```bash
# SSH ke EC2
ssh -i ~/.ssh/book-app-key.pem ubuntu@<ELASTIC_IP>

cd book-app

# Stop container yang berjalan
docker-compose down

# Lihat history commit
git log --oneline

# Kembali ke commit sebelumnya
git checkout <commit-hash>

# Rebuild dan jalankan ulang
docker-compose up -d --build
```

### Roll Back Docker Image (via Docker Hub / GHCR)

Jika menggunakan image dari registry, ganti tag image di `docker-compose.yml`:

```yaml
# Ganti dari
image: ghcr.io/evovincere/book-app-backend:latest

# Menjadi versi sebelumnya
image: ghcr.io/evovincere/book-app-backend:v1.0.0
```

Lalu:
```bash
docker-compose up -d
```

### Roll Back Infrastructure (Terraform)

```bash
cd terraform/

# Hapus semua resource (hati-hati di production)
terraform destroy

# Atau restore dari state versi sebelumnya
terraform apply -target=aws_instance.web_server
```

---

## Useful Commands

```bash
# Lihat log semua service
docker-compose logs -f

# Lihat log service tertentu
docker-compose logs -f backend

# Restart service tertentu
docker-compose restart backend

# Rebuild satu service
docker-compose up -d --build backend

# Stop semua service
docker-compose down

# Stop dan hapus volume (HATI-HATI: data hilang)
docker-compose down -v
```

---

## CI/CD Pipeline

Pipeline GitHub Actions otomatis berjalan saat push ke branch `main`:

```
push to main
    │
    ├── lint      → flake8 (backend) / eslint (frontend)
    ├── build     → docker build multi-stage
    ├── test      → unit test Flask
    └── push      → push image ke GHCR
```

---

## Security Notes

> ⚠️ Konfigurasi ini untuk environment **Dev/Testing**.
> Untuk production, perlu:
> - Batasi port 9090 & 9100 hanya untuk IP internal (bukan `0.0.0.0/0`)
> - Ganti `GF_SECURITY_ADMIN_PASSWORD` dengan password kuat
> - Gunakan HTTPS (SSL/TLS) untuk semua endpoint publik
> - Buat SSH key pair secara eksternal, bukan via `tls_private_key` Terraform
