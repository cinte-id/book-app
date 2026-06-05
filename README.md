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

---

# Book Tracker App

A full-stack web application for managing your reading list, built with Flask and React. Build for People Recruitment Test. Integration with backend only works on page Library section Browse Library. Live preview on: https://book-app.cinte.id/

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

## Prerequisites

- Python 3.x
- Node.js 16.x or later
- npm or yarn

## Getting Started

### Backend Setup

1. Create and activate a virtual environment:
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
cd backend
python app.py
```

The backend server will start on http://localhost:5000

### Frontend Setup

1. Install frontend dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Documentation

### Endpoints

#### GET /api/books
- Returns all books
- Response: Array of book objects

#### POST /api/books
- Creates a new book
- Request Body:
```json
{
  "title": "string",
  "author": "string",
  "status": "unread" | "reading" | "completed"
}
```

#### PUT /api/books/<id>
- Updates an existing book
- Request Body: Same as POST

#### DELETE /api/books/<id>
- Deletes a book by ID

## Project Structure

```
book-app/
├── backend/
│   └── app.py              # Flask backend API
├── frontend/
│   ├── src/
│   │   ├── types/
│   │   │   └── book.ts     # TypeScript interfaces
│   │   ├── services/
│   │   │   └── api.ts      # API service functions
│   │   ├── App.tsx         # Main React component
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── tailwind.config.js  # Tailwind configuration
│   └── package.json        # Frontend dependencies
└── requirements.txt        # Backend dependencies
```

## Development

### Backend Development
- The backend uses Flask for the API
- CORS is enabled for frontend communication
- Currently using in-memory storage (can be extended to use a database)

### Frontend Development
- Built with React + Vite for fast development
- TypeScript for type safety
- Tailwind CSS for styling
- shadcn/ui components for consistent UI

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] Authentication system
- [ ] Search and filtering
- [ ] Sorting options
- [ ] Book categories/tags
- [ ] Reading progress tracking
- [ ] Book ratings and reviews
- [ ] Database integration
- [ ] User profiles and personal libraries

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
push / PR → main
      │
  ┌───▼────┐   ┌────────┐   ┌──────┐   ┌────────────────┐   ┌──────────────────┐
  │  Lint  │──►│ Build  │──►│ Test │──►│  Trivy Scan    │──►│  Push to GHCR    │
  │        │   │ Docker │   │ API  │   │  CRITICAL vulns│   │  (main only)     │
  │ ruff   │   │ images │   │ e2e  │   │  block push    │   │  :latest + :sha  │
  │ eslint │   │        │   │      │   │  SARIF → GH    │   │                  │
  └────────┘   └────────┘   └──────┘   └────────────────┘   └──────────────────┘
```

Images published to: `ghcr.io/<owner>/book-app-backend` and `ghcr.io/<owner>/book-app-frontend`

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
cd ansible

# Install Ansible if needed
pip install ansible

# Run the playbook (provisions local Docker environment end-to-end)
ansible-playbook -i inventory.ini playbook.yml
```

The playbook: checks Docker, creates data dir, builds images, starts services, waits for health check, and prints URLs.

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
├── scripts/
│   └── healthcheck.sh          # HTTP poll script (used in CI + Ansible)
├── docker-compose.yml          # App stack: backend + frontend + nginx (sidecar)
├── TASKS_DEVOPS_MID.md         # Task requirements reference
└── .github/
    └── workflows/
        └── ci.yml              # lint → build → test → Trivy scan → push to GHCR
```
