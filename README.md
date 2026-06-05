# Test Instruction

Hi there! 👋  
Thanks for applying to our company.

This is a small take-home assignment where you'll contribute to a simple **Book Tracker App**.  
You can choose how to contribute based on your strongest area: **Frontend, Backend, DevOps, QA, or Data**.

---

## 🧭 Goal

We want to see how you solve problems, write code, and structure your work — all in about **2–4 hours**.

---

If you're applying for **DevOps**, **QA**, or **Data**, you can use the provided base code in the `backend/` or `frontend/` folders.

---

## ✅ What to Do

1. **Fork this repo** into your own GitHub account.
2. **Pick ONE area** you're applying in:
   - Frontend
   - Backend
   - DevOps
   - QA
   - Data
   - Project/Product Manager
   - UI/UX
   - Customer Services
3. **Work only in the part that fits your chosen role.**
4. Push your code and include in your `README.md`:
   - Your chosen role
   - How to run/test your part
   - Any notes or decisions you made
5. Create a Pull Request (PR) to the main branch of this repository
6. Share the PR link with us for review

---

## 🔧 Tasks by Role

Choose your role and follow the detailed task instructions:

- [🔹 **Fullstack** (Junior)](TASKS_FULLSTACK.md) - Complete Library Browse page features
- [🔹 **Fullstack** (Mid-Level)](TASKS_FULLSTACK_MID.md) - Complete Library Browse page features (mid-level)
- [🔹 **Frontend**](TASKS_FRONTEND.md) - Build User Authentication, Settings, and Insight UIs
- [🔹 **Backend**](TASKS_BACKEND.md) - Build REST API with search and filtering
- [🔹 **DevOps** (Junior)](TASKS_DEVOPS.md) - Create Dockerfiles and CI/CD workflows
- [🔹 **DevOps** (Mid-Level)](TASKS_DEVOPS_MID.md) - Create Dockerfiles and CI/CD workflows (mid-level)
- [🔹 **QA**](TASKS_QA.md) - Create comprehensive test plans and execute testing
- [🔹 **UI/UX**](TASKS_UIUX.md) - Design User Authentication and Settings pages
- [🔹 **Project/Product Manager** (Junior)](TASKS_PM.md) - Create project timelines and task breakdowns
- [🔹 **Project/Product Manager** (Mid-Level)](TASKS_PM_MID.md) - Create full project plan with risk register and stakeholder plan
- [🔹 **Data Analytic Engineer**](TASKS_DATA.md) - Build data analytics solution and dashboard
- [🔹 **Customer Service**](TASKS_CUSTOMER_SERVICE.md) - Create customer support system

---

## 🌟 Bonus Points (Optional)

We appreciate extra touches like:

- ✅ Clean code structure / design pattern
- ✅ Branching with meaningful commit history
- ✅ README with clear instructions
- ✅ Use of linters, formatters, or type checkers
- ✅ Tests even if you're not applying for QA
- ✅ CI workflow using GitHub Actions
- ✅ UI polish, error handling, logging, etc.

---

## 🕐 Timebox

This should take around **2–4 hours**.  
No need to overengineer — focus on clarity and your best work in a short time.

---

## 📩 Submission

Once you're done:
1. Create a Pull Request (PR) to the main branch of this repository
2. Share the PR link with us for review

**Note**: We prefer PRs to the original repository rather than separate repo links, as this allows us to see your changes in context and review your contribution directly.

Good luck, and have fun! 🚀

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
  ┌───▼────┐   ┌────────┐   ┌──────┐   ┌──────────────────┐
  │  Lint  │──►│ Build  │──►│ Test │──►│  Push to GHCR    │
  │        │   │ Docker │   │ API  │   │  (main only)     │
  │ ruff   │   │ images │   │ e2e  │   │  :latest + :sha  │
  │ eslint │   │        │   │      │   │                  │
  └────────┘   └────────┘   └──────┘   └──────────────────┘
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

## Project Structure (DevOps additions)

```
book-app/
├── backend/
│   └── Dockerfile              # Multi-stage: builder → runtime
├── frontend/
│   ├── Dockerfile              # Multi-stage: node build → nginx static
│   └── nginx.conf              # SPA fallback + cache headers
├── nginx/
│   └── nginx.conf              # Reverse proxy: / → frontend, /api → backend
├── monitoring/
│   ├── docker-compose.yml      # Prometheus + Grafana + blackbox + cAdvisor
│   ├── prometheus/
│   │   ├── prometheus.yml      # Scrape configs
│   │   └── alert-rules.yml     # BackendDown, HighResponseTime, HighMemory alerts
│   └── grafana/
│       ├── provisioning/       # Auto-configured datasource + dashboard
│       └── dashboards/
│           └── book-app.json   # Pre-built dashboard (6 panels)
├── ansible/
│   ├── playbook.yml            # Provision + deploy local environment
│   └── inventory.ini           # localhost target
├── scripts/
│   └── healthcheck.sh          # HTTP poll script used in CI and Ansible
├── docker-compose.yml          # App stack: backend + frontend + nginx
└── .github/
    └── workflows/
        └── ci.yml              # lint → build → test → push (GHCR)
```
