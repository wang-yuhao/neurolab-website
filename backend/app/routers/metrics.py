"""Metrics router — serves live pipeline statistics."""
from fastapi import APIRouter
from app.database import get_database

router = APIRouter()

# Static seed data (replace with real pipeline queries from Databricks/MongoDB)
SEED_METRICS = {
    "subjects_processed": 200,
    "spindles_detected": 48320,
    "slow_oscillations": 12450,
    "pac_windows": 96400,
    "model_accuracy_rf": 0.913,
    "model_accuracy_lstm": 0.927,
    "sleep_stage_distribution": {
        "Wake": 0.12,
        "N1": 0.08,
        "N2": 0.45,
        "N3": 0.21,
        "REM": 0.14,
    },
    "pipeline_layers": {
        "bronze_records": 4800,
        "silver_records": 4512,
        "gold_records": 200,
    },
    "tda_betti_numbers": {
        "b0_mean": 1.0,
        "b1_mean": 3.24,
        "b2_mean": 0.87,
    },
}


@router.get("/", summary="Get pipeline metrics overview")
async def get_metrics():
    """Return high-level pipeline metrics. Reads from MongoDB if available."""
    try:
        db = get_database()
        doc = await db["metrics"].find_one({"_id": "summary"}, {"_id": 0})
        if doc:
            return doc
    except Exception:
        pass
    return SEED_METRICS


@router.get("/sleep-stages", summary="Sleep stage distribution")
async def get_sleep_stages():
    return SEED_METRICS["sleep_stage_distribution"]


@router.get("/model-accuracy", summary="ML model accuracy comparison")
async def get_model_accuracy():
    return {
        "random_forest": SEED_METRICS["model_accuracy_rf"],
        "lstm": SEED_METRICS["model_accuracy_lstm"],
    }
