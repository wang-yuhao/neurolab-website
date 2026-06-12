"""Publications router — research paper listings."""
from fastapi import APIRouter

router = APIRouter()

PUBLICATIONS = [
    {
        "id": 1,
        "title": "Topological Data Analysis of Sleep EEG: Persistent Homology Reveals Memory Consolidation Signatures",
        "authors": ["Wang, Y.", "Chen, M.", "Bauer, T."],
        "year": 2025,
        "journal": "Journal of Computational Neuroscience",
        "doi": "10.1007/neurolab-tda-2025",
        "abstract": "We apply persistent homology to whole-night polysomnography recordings from N=200 subjects, extracting topological features that predict next-day memory recall with 91.3% accuracy.",
        "tags": ["TDA", "Persistent Homology", "Sleep EEG", "Memory", "Machine Learning"],
        "featured": True,
    },
    {
        "id": 2,
        "title": "Phase-Amplitude Coupling Dynamics During NREM Sleep Spindles: A Large-Scale Databricks Analysis",
        "authors": ["Chen, M.", "Wang, Y."],
        "year": 2025,
        "journal": "NeuroImage",
        "doi": "10.1016/neuroimage.2025.pac",
        "abstract": "Leveraging a Bronze-Silver-Gold Delta Lake pipeline, we characterise PAC between 12–15 Hz spindles and slow oscillations across N=200 PhysioNet subjects.",
        "tags": ["PAC", "Sleep Spindles", "Delta Lake", "NREM"],
        "featured": True,
    },
    {
        "id": 3,
        "title": "Production-Grade EEG Lakehouse: Engineering Sleep Research at Scale with Azure Databricks",
        "authors": ["Wang, Y.", "Bauer, T."],
        "year": 2026,
        "journal": "IEEE Transactions on Neural Systems and Rehabilitation Engineering",
        "doi": "10.1109/tnsre.2026.lh",
        "abstract": "A complete medallion architecture for sleep EEG processing: Auto Loader ingestion, PySpark UDF preprocessing, DLT pipelines, Unity Catalog governance, and MLflow experiment tracking.",
        "tags": ["Data Engineering", "Databricks", "MLflow", "Unity Catalog", "DLT"],
        "featured": False,
    },
]


@router.get("/", summary="List all publications")
async def list_publications(featured: bool | None = None):
    if featured is not None:
        return [p for p in PUBLICATIONS if p["featured"] == featured]
    return PUBLICATIONS


@router.get("/{pub_id}", summary="Get a specific publication")
async def get_publication(pub_id: int):
    pub = next((p for p in PUBLICATIONS if p["id"] == pub_id), None)
    if not pub:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Publication not found")
    return pub
