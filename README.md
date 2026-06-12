# NeuroLab — Sleep EEG Research Platform

> A production-grade computational neuroscience company website showcasing the **Sleep EEG TDA Research Pipeline** (Persistent Homology, Memory Consolidation) built on Databricks Lakehouse.

![CI](https://github.com/wang-yuhao/neurolab-website/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20FastAPI%20%7C%20MongoDB%20%7C%20Docker-blueviolet)

---

## What This Website Does

NeuroLab is a **fancy, technology-forward company website** for a computational neuroscience research lab. It presents:

1. **Research Overview** — Sleep EEG pipeline with TDA / Persistent Homology, Phase-Amplitude Coupling, sleep spindle & slow-oscillation detection.
2. **Interactive Pipeline Visualizer** — Animated Bronze → Silver → Gold medallion architecture diagram.
3. **Publications & Methods** — Searchable research summaries, methodology cards.
4. **Team Page** — Researcher profiles with expertise tags.
5. **Live Metrics Dashboard** — REST API serving pipeline stats (subjects processed, model accuracy, sleep-stage distributions).
6. **Contact / Join Us** — Form-based contact with MongoDB persistence.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     NGINX (port 80 / 443)                   │
│          Reverse-proxy + static asset serving               │
└───────────────────┬───────────────────┬─────────────────────┘
                    │                   │
         ┌──────────▼──────┐   ┌────────▼────────────┐
         │  React Frontend │   │  FastAPI Backend     │
         │  (port 3000)    │   │  (port 8000)         │
         │  TypeScript     │   │  Python 3.11         │
         │  Tailwind CSS   │   │  Uvicorn + Pydantic  │
         │  Three.js       │   │  Motor (async Mongo) │
         └─────────────────┘   └────────┬────────────┘
                                        │
                               ┌────────▼────────┐
                               │   MongoDB 6      │
                               │   (port 27017)   │
                               └─────────────────┘
```

### Key Technology Choices

| Layer        | Technology                                 | Reason                                          |
|--------------|--------------------------------------------|-------------------------------------------------|
| Frontend     | React 18 + TypeScript + Vite               | Fast, type-safe, modern SPA                     |
| Styling      | Tailwind CSS + Framer Motion               | Utility-first + fluid animations                |
| 3D / WebGL   | Three.js + react-three-fiber               | Brain wave / topology visualisations            |
| Charts       | Recharts + D3.js                           | EEG signal charts, sleep hypnogram             |
| Backend      | FastAPI (Python 3.11)                      | Async, auto OpenAPI docs, Pydantic validation   |
| Database     | MongoDB 6 (Motor async driver)             | Flexible schema for research metadata           |
| Proxy        | Nginx                                      | Static serving + API routing                    |
| Container    | Docker + Docker Compose                    | One-command local & production setup            |
| CI/CD        | GitHub Actions                             | Lint, test, build, deploy on push               |

---

## Repository Structure

```
neurolab-website/
├── frontend/                   # React + TypeScript SPA
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── PipelineVisualizer.tsx
│   │   │   ├── ResearchCard.tsx
│   │   │   ├── MetricsDashboard.tsx
│   │   │   ├── TeamCard.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── Research.tsx
│   │   │   ├── Pipeline.tsx
│   │   │   ├── Team.tsx
│   │   │   └── Contact.tsx
│   │   ├── hooks/              # Custom React hooks
│   │   ├── api/                # Axios API client
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── backend/                    # FastAPI Python backend
│   ├── app/
│   │   ├── main.py             # FastAPI app entrypoint
│   │   ├── config.py           # Settings via pydantic-settings
│   │   ├── database.py         # Motor MongoDB connection
│   │   ├── models/
│   │   │   ├── contact.py
│   │   │   ├── metric.py
│   │   │   └── publication.py
│   │   └── routers/
│   │       ├── metrics.py
│   │       ├── publications.py
│   │       └── contact.py
│   ├── requirements.txt
│   └── Dockerfile
├── nginx/
│   └── conf.d/
│       └── default.conf
├── docker-compose.yml
├── docker-compose.prod.yml
├── .github/
│   └── workflows/
│       └── ci.yml
├── SETUP.md                    # Step-by-step implementation guide
└── README.md
```

---

## Quick Start (Local Development)

```bash
# 1. Clone
git clone https://github.com/wang-yuhao/neurolab-website.git
cd neurolab-website

# 2. Copy environment template
cp .env.example .env

# 3. Start all services
docker compose up --build

# 4. Open in browser
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000/docs  (Swagger UI)
# App:       http://localhost:80
```

---

## See Also

- [Databricks EEG Lakehouse Lab](https://github.com/wang-yuhao/databricks-eeg-lakehouse-lab) — the underlying research pipeline
- [SETUP.md](./SETUP.md) — full step-by-step implementation instructions
- [API Docs](http://localhost:8000/docs) — auto-generated OpenAPI / Swagger

---

## License

MIT © 2026 NeuroLab Research
