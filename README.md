# Book Tracker App — DevOps Mid-Level Submission

**Role:** DevOps & Infrastructure Engineer (Mid-Level)
**Task reference:** [TASKS_DEVOPS_MID.md](TASKS_DEVOPS_MID.md)

## Deliverables

| # | Required | Status |
|---|----------|--------|
| 1 | Multi-stage Dockerfile + docker-compose with sidecar (nginx) | ✅ |
| 2 | CI/CD pipeline: lint → build → test → push to GHCR | ✅ |
| 3 | IaC (Ansible) — local environment + firewall provisioning | ✅ |
| 4 | Monitoring: Prometheus + Grafana, alerts, pre-built dashboard | ✅ |
| 5 | README / Runbook — architecture diagram, deploy, rollback | ✅ |

| # | Bonus | Status |
|---|-------|--------|
| 1 | Kubernetes manifests (Deployment, Service, ConfigMap, Ingress) | ✅ |
| 2 | GitOps with ArgoCD | ✅ |
| 3 | Trivy image vulnerability scan in CI | ✅ |
| 4 | IaC for networking resource (ufw firewall rules via Ansible) | ✅ |
| 5 | On-call runbook (service down + high memory scenarios) | ✅ |
| 6 | Secrets management (GitHub Secrets wired into CI) | ✅ |
| 7 | Multi-environment config (staging + production) | ✅ |

---

# Book Tracker App

A full-stack web application for managing your reading list, built with Flask and React.

<img src="./assets/home.png" height="200" alt="Home">
<img src="./assets/library.png" height="200" alt="Library">

## Features

- 📚 Add, view, update, and delete books
- 📖 Track reading status (unread/reading/completed)
- 🎨 Modern and responsive UI with Tailwind CSS
- 🔄 Real-time updates
- ⚡ Fast and efficient with React + Vite
- 🛡️ Type-safe with TypeScript

## Tech Stack

### Backend
- Python 3.x
- Flask
- Flask-CORS
- SQLAlchemy
- python-dotenv

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Axios
- shadcn/ui components

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books` | List all books |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/<id>` | Update a book |
| DELETE | `/api/books/<id>` | Delete a book |
| GET | `/api/test` | Health check |

---

# DevOps Setup — Infrastructure & Runbook

> Role: DevOps Mid-Level
> Stack: Docker (multi-stage) · Nginx · GitHub Actions · Ansible · Prometheus · Grafana

## Architecture

```
                         Internet
                             │
                          :80
                      ┌────────┐
                      │ Nginx  │  ← reverse proxy (sidecar)
                      └───┬────┘
              ┌────────────┴────────────┐
         /api/*                        /
     ┌──────────┐               ┌──────────────┐
     │ Backend  │               │  Frontend    │
     │  Flask   │               │  nginx+SPA   │
     │  :5001   │               │    :80       │
     └────┬─────┘               └──────────────┘
          │ books.json
     ┌────▼─────┐
     │  Volume  │  ← persistent data
     └──────────┘

Monitoring (separate compose):

  ┌──────────────┐     scrape     ┌────────────┐
  │  Prometheus  │ ◄──────────── │  cAdvisor  │  container metrics
  │    :9090     │               └────────────┘
  └──────┬───────┘
         │            probe       ┌──────────────────┐
         │ ◄──────────────────── │ blackbox-exporter │  HTTP health
         │                       └──────────────────┘
  ┌──────▼───────┐
  │   Grafana    │  ← dashboards + alert rules
  │    :3000     │
  └──────────────┘
```

## CI/CD Pipeline

```
push / PR → main or staging
      │
  ┌───▼────┐   ┌────────┐   ┌──────┐   ┌────────────────┐   ┌───────────────────────────┐
  │  Lint  │──►│ Build  │──►│ Test │──►│  Trivy Scan    │──►│  Push to GHCR             │
  │        │   │ Docker │   │ API  │   │  CRITICAL vulns│   │  main   → :latest + :sha  │
  │ ruff   │   │ images │   │ e2e  │   │  block push    │   │  staging → :staging + :sha│
  │ eslint │   │        │   │      │   │  SARIF → GH    │   │                           │
  └────────┘   └────────┘   └──────┘   └────────────────┘   └───────────────────────────┘
```

Images published to: `ghcr.io/ndanhd/book-app-backend` and `ghcr.io/ndanhd/book-app-frontend`

## Deploy Runbook

### Prerequisites

- Docker >= 24
- Docker Compose plugin (`docker compose version`)
- Ansible >= 2.14 (`pip install ansible`) — for automated provisioning

### Option A — Manual (Docker Compose)

```bash
# 1. Clone and enter the repo
git clone <repo-url> && cd book-app

# 2. Build and start all services
docker compose up -d --build

# 3. Verify
curl http://localhost/api/test
# → {"message": "CORS is working!"}

# App is live at http://localhost
```

### Option B — Ansible Playbook (automated provisioning)

```bash
# Install Ansible if needed
python3 -m venv .venv && .venv/bin/pip install ansible -q
```

**Dev mode** — build image dari source lokal:
```bash
.venv/bin/ansible-playbook -i ansible/inventory.ini ansible/playbook.yml
```

**Production mode** — pull image dari GHCR (image harus sudah ada di registry):
```bash
.venv/bin/ansible-playbook -i ansible/inventory.ini ansible/playbook.yml -e "image_tag=latest"
```

Ganti `latest` dengan SHA commit tertentu untuk deploy versi spesifik:
```bash
.venv/bin/ansible-playbook -i ansible/inventory.ini ansible/playbook.yml -e "image_tag=<commit-sha>"
```

The playbook: checks Docker, creates data dir, pulls/builds images, starts services, waits for health check, and prints URLs.

### Start Monitoring Stack

```bash
# App stack must be running first (monitoring connects to book-app_network)
cd monitoring
docker compose up -d

# Access points:
# Grafana   → http://localhost:3000  (admin / admin)
# Prometheus → http://localhost:9090
# Blackbox  → http://localhost:9115
```

Dashboard "Book App — Overview" is pre-provisioned — visible immediately on login.

### Health Check Script

```bash
# Poll until endpoint returns 2xx (useful in scripts/CI)
bash scripts/healthcheck.sh http://localhost/api/test
```

## Multi-Environment Config

| Environment | Branch | Image tag | Port | Config file |
|-------------|--------|-----------|------|-------------|
| Development | local  | `local` (built from source) | 80 | — |
| Staging     | `staging` | `staging` / `staging-<sha>` | 8080 | `envs/staging.env` |
| Production  | `main` | `latest` / `<sha>` | 80 | `envs/production.env` |

**Deploy staging:**
```bash
IMAGE_TAG=staging SECRET_KEY=<value> \
  docker compose -f docker-compose.yml -f docker-compose.staging.yml up -d
```

**Deploy production:**
```bash
IMAGE_TAG=latest SECRET_KEY=<value> \
  docker compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

**Via Ansible:**
```bash
# Staging
.venv/bin/ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
  -e "image_tag=staging"

# Production
.venv/bin/ansible-playbook -i ansible/inventory.ini ansible/playbook.yml \
  -e "image_tag=latest"
```

## Secrets Management

Secrets are **never hardcoded** in env files or code. They are injected at runtime via GitHub Secrets.

**GitHub Secrets to configure** (Settings → Secrets and variables → Actions):

| Secret name | Used in | Description |
|-------------|---------|-------------|
| `SECRET_KEY` | CI test stage, deploy | Flask secret key (generate: `python3 -c "import secrets; print(secrets.token_hex(32))"`) |
| `STAGING_SECRET_KEY` | Staging deploy | Separate key for staging environment |
| `PROD_SECRET_KEY` | Production deploy | Separate key for production environment |

`GITHUB_TOKEN` is auto-provided by GitHub Actions — no manual setup needed for GHCR push.

**Local development** — create a local override (not committed):
```bash
cp envs/staging.env envs/staging.env.local
# Edit staging.env.local and set real SECRET_KEY
```

## Rollback Runbook

### Rollback to previous image (GHCR)

```bash
# Pull specific SHA tag
docker pull ghcr.io/<owner>/book-app-backend:<previous-sha>
docker pull ghcr.io/<owner>/book-app-frontend:<previous-sha>

# Update compose to use that tag, then restart
BACKEND_IMAGE=ghcr.io/<owner>/book-app-backend:<previous-sha> \
FRONTEND_IMAGE=ghcr.io/<owner>/book-app-frontend:<previous-sha> \
docker compose up -d
```

### Rollback config only

```bash
git revert HEAD        # revert the bad commit
git push origin main   # triggers CI, new images built and pushed
docker compose pull && docker compose up -d
```

### Emergency: restart single service

```bash
docker compose restart backend
docker compose logs -f backend
```

## Troubleshooting

| Symptom | Check |
|---------|-------|
| 502 Bad Gateway | `docker compose ps` — is backend healthy? `docker compose logs backend` |
| books.json lost on restart | Volume `book_data` should persist it — run `docker volume inspect book-app_book_data` |
| Grafana shows no data | Prometheus must be on `app-network` — check `docker network inspect book-app_network` |
| cAdvisor empty metrics | Linux only — on macOS some cgroups metrics are unavailable, expected |
| CI lint fails | Run `ruff check backend/` and `cd frontend && npm run lint` locally first |

## Project Structure

```
book-app/
├── backend/
│   ├── app.py                  # Flask REST API
│   ├── requirements.txt
│   └── Dockerfile              # Multi-stage: builder → slim runtime
├── frontend/
│   ├── src/                    # React + TypeScript source
│   ├── nginx.conf              # SPA fallback + static asset cache headers
│   └── Dockerfile              # Multi-stage: node build → nginx static
├── nginx/
│   └── nginx.conf              # Reverse proxy: /api → backend, / → frontend
├── monitoring/
│   ├── docker-compose.yml      # Prometheus + Grafana + blackbox + cAdvisor
│   ├── prometheus/
│   │   ├── prometheus.yml      # Scrape configs (blackbox + cAdvisor)
│   │   └── alert-rules.yml     # BackendDown, HighResponseTime, HighMemory
│   └── grafana/
│       ├── provisioning/       # Auto-configured datasource + dashboard loader
│       └── dashboards/
│           └── book-app.json   # Pre-built dashboard (6 panels)
├── k8s/
│   ├── namespace.yml
│   ├── configmap.yml           # Backend env config
│   ├── ingress.yml             # nginx ingress: /api → backend, / → frontend
│   ├── backend/
│   │   ├── deployment.yml      # Liveness + readiness probes, resource limits
│   │   ├── service.yml
│   │   └── pvc.yml             # Persistent storage for books.json
│   └── frontend/
│       ├── deployment.yml      # 2 replicas
│       └── service.yml
├── ansible/
│   ├── playbook.yml            # Provision + deploy local environment end-to-end
│   ├── networking.yml          # Firewall rules via ufw (IaC networking resource)
│   └── inventory.ini           # Target: localhost
├── gitops/
│   ├── argocd-app.yml          # ArgoCD Application — watches k8s/ dir, auto-syncs
│   └── README.md               # ArgoCD install + usage guide
├── docs/
│   └── oncall-runbook.md       # On-call runbook: service down + high memory
├── envs/
│   ├── staging.env             # Staging env config (no secrets — injected at runtime)
│   └── production.env          # Production env config (no secrets — injected at runtime)
├── scripts/
│   └── healthcheck.sh          # HTTP poll script (used in CI + Ansible)
├── docker-compose.yml          # App stack: backend + frontend + nginx (sidecar)
├── docker-compose.staging.yml  # Staging override (port 8080, staging env)
├── docker-compose.production.yml # Production override (resource limits, prod env)
├── TASKS_DEVOPS_MID.md         # Task requirements reference
└── .github/
    └── workflows/
        └── ci.yml              # lint → build → test → Trivy scan → push to GHCR
```
