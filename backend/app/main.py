"""
NeuroLab FastAPI Backend
========================
Production-grade REST API for the Sleep EEG Research Platform.
Provides endpoints for pipeline metrics, publications, team data, and contact.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import connect_db, close_db
from app.routers import metrics, publications, contact, team


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle manager."""
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="NeuroLab API",
    description="Sleep EEG TDA Research Platform — REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────
app.include_router(metrics.router,      prefix="/metrics",      tags=["Metrics"])
app.include_router(publications.router, prefix="/publications", tags=["Publications"])
app.include_router(contact.router,      prefix="/contact",      tags=["Contact"])
app.include_router(team.router,         prefix="/team",         tags=["Team"])


@app.get("/", tags=["Root"])
async def root():
    return {"message": "NeuroLab API is running", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health_check():
    """Liveness probe for Docker / Kubernetes."""
    return JSONResponse(content={"status": "healthy"}, status_code=200)
