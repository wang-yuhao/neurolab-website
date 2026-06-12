# SETUP.md — NeuroLab Website

Complete guide for local development, production deployment, and Databricks integration.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Environment Variables](#environment-variables)
4. [Docker Deployment](#docker-deployment)
5. [Production Deployment](#production-deployment)
6. [Databricks Integration](#databricks-integration)
7. [CI/CD Pipeline](#cicd-pipeline)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|------------------------------------------------------|
| Docker | >= 24.x | Container runtime |
| Docker Compose | >= 2.x | Multi-container orchestration |
| Node.js | >= 20.x | Frontend build toolchain |
| Python | >= 3.11 | Backend runtime |
| MongoDB | >= 7.x | Database (or use Docker service) |
| Git | >= 2.x | Version control |

### Optional (for Databricks integration)

- Databricks CLI >= 0.200
- Azure CLI >= 2.x
- Databricks Asset Bundles (DABs) support

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/wang-yuhao/neurolab-website.git
cd neurolab-website
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

Create a local `.env` file inside `backend/`:

```env
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=neurolab
SECRET_KEY=dev-secret-change-in-production
DEBUG=true
```

Start the backend:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API docs will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a local `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `MONGODB_URL` | Yes | — | MongoDB connection string |
| `DATABASE_NAME` | Yes | `neurolab` | MongoDB database name |
| `SECRET_KEY` | Yes | — | JWT signing secret |
| `DEBUG` | No | `false` | Enable debug mode |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:8000` | Backend API URL |

### Docker Compose (`.env` at repo root)

```env
MONGODB_URL=mongodb://mongo:27017
DATABASE_NAME=neurolab
SECRET_KEY=change-me-in-production
VITE_API_BASE_URL=http://localhost:8000
```

---

## Docker Deployment

### Development Stack

```bash
# Copy and edit environment file
cp .env.example .env

# Build and start all services
docker compose up --build
```

Services started:
- `frontend` → http://localhost:5173
- `backend` → http://localhost:8000
- `mongo` → localhost:27017
- `nginx` (production profile) → http://localhost:80

### Production Stack

```bash
docker compose --profile production up -d --build
```

Nginx will reverse-proxy:
- `/` → frontend (React SPA)
- `/api/` → backend (FastAPI)

### Health Checks

```bash
# Check backend health
curl http://localhost:8000/health

# Check all container statuses
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Production Deployment

### Recommended Stack

- **Cloud Provider**: Azure (AKS or Azure Container Instances)
- **Registry**: GitHub Container Registry (GHCR) or Azure Container Registry
- **Reverse Proxy**: Nginx (included) or Azure Application Gateway
- **Database**: Azure Cosmos DB for MongoDB API (production-grade)
- **Secrets Management**: Azure Key Vault

### Manual Production Steps

```bash
# 1. Build images
docker build -t neurolab-backend ./backend
docker build -t neurolab-frontend ./frontend

# 2. Tag and push to registry
docker tag neurolab-backend ghcr.io/wang-yuhao/neurolab-website/backend:latest
docker push ghcr.io/wang-yuhao/neurolab-website/backend:latest

docker tag neurolab-frontend ghcr.io/wang-yuhao/neurolab-website/frontend:latest
docker push ghcr.io/wang-yuhao/neurolab-website/frontend:latest

# 3. Deploy using Docker Compose on remote host
ssh user@your-server
docker compose --profile production pull
docker compose --profile production up -d
```

### SSL/TLS

For production, update `nginx/nginx.conf` to include SSL certificates. Use Let's Encrypt with Certbot:

```bash
certbot --nginx -d yourdomain.com
```

---

## Databricks Integration

The NeuroLab pipeline processes EEG data through a **Medallion Architecture**:

```
Bronze Layer  →  Raw EEG recordings (Delta Lake)
Silver Layer  →  Filtered + segmented signals (Delta Lake)
Gold Layer    →  TDA features + model outputs (Delta Lake)
```

### Unity Catalog Configuration

```sql
-- Create catalog and schema
CREATE CATALOG IF NOT EXISTS neurolab;
CREATE SCHEMA IF NOT EXISTS neurolab.eeg_pipeline;

-- Grant permissions
GRANT USE CATALOG ON CATALOG neurolab TO `data-engineers`;
GRANT USE SCHEMA ON SCHEMA neurolab.eeg_pipeline TO `data-engineers`;
```

### Databricks Asset Bundles (DABs)

The pipeline configuration is defined in `databricks/databricks.yml`:

```bash
# Install Databricks CLI
pip install databricks-cli

# Authenticate
databricks configure --token

# Deploy pipeline bundle
databricks bundle deploy --target staging
databricks bundle deploy --target production

# Run pipeline
databricks bundle run eeg_pipeline_job
```

### API Integration with Databricks

The backend fetches aggregated metrics from the Gold layer via the Databricks SQL Connector:

```python
# Configured in backend/app/config.py
DATABRICKS_HOST=https://adb-xxxx.azuredatabricks.net
DATABRICKS_TOKEN=dapi...
DATABRICKS_WAREHOUSE_ID=xxxx
```

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR:

### Pipeline Stages

```
Push to main/develop
        │
        ├─── backend-test ──── Python lint + pytest
        │
        ├─── frontend-test ─── npm lint + TypeScript build
        │
        ├─── docker-build ──── Build & push to GHCR (main only)
        │        └── Requires: backend-test + frontend-test
        │
        └─── security-scan ─── Trivy filesystem scan
```

### Secrets Required (GitHub Repository Settings)

| Secret | Description |
|--------|-------------|
| `GITHUB_TOKEN` | Auto-provided by GitHub Actions |
| `MONGODB_URL` | Production MongoDB connection string |
| `SECRET_KEY` | Application secret key |
| `DATABRICKS_TOKEN` | Databricks personal access token |

---

## Troubleshooting

### MongoDB Connection Error

```bash
# Verify MongoDB is running
docker compose ps mongo

# Check connection manually
mongosh mongodb://localhost:27017
```

### Backend Startup Failure

```bash
# Check logs
docker compose logs backend

# Verify environment variables
docker compose exec backend env | grep MONGODB
```

### Frontend Build Error

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port Conflicts

If ports 8000, 5173, or 27017 are in use:

```bash
# Find process using port
lsof -i :8000

# Or adjust ports in docker-compose.yml
ports:
  - "8001:8000"  # host:container
```

### Docker Build Issues

```bash
# Rebuild without cache
docker compose build --no-cache

# Prune unused images
docker system prune -f
```

---

## Project Structure Reference

```
neurolab-website/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI app entry point
│   │   ├── config.py           # Settings (pydantic-settings)
│   │   ├── database.py         # MongoDB connection
│   │   └── routers/
│   │       ├── metrics.py      # GET /api/metrics
│   │       ├── publications.py # GET /api/publications
│   │       ├── team.py         # GET /api/team
│   │       └── contact.py      # POST /api/contact
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/              # React page components
│   │   ├── components/         # Shared components
│   │   └── api/                # Axios API client
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   └── nginx.conf              # Reverse proxy config
├── docker-compose.yml
└── README.md
```

---

*For questions or issues, open a GitHub Issue or contact the NeuroLab team.*
