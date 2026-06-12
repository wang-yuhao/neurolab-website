"""Team router — researcher profiles."""
from fastapi import APIRouter

router = APIRouter()

TEAM = [
    {
        "id": 1,
        "name": "Dr. Yuhao Wang",
        "role": "Principal Investigator & Lead Data Engineer",
        "bio": "Expert in sleep EEG signal processing, topological data analysis, and large-scale Lakehouse architectures on Azure Databricks.",
        "expertise": ["Sleep EEG", "TDA", "Persistent Homology", "Apache Spark", "Delta Lake", "MLflow"],
        "avatar": "/avatars/yuhao.png",
        "github": "https://github.com/wang-yuhao",
        "publications": 12,
    },
    {
        "id": 2,
        "name": "Dr. Maria Chen",
        "role": "Computational Neuroscientist",
        "bio": "Specialises in phase-amplitude coupling, memory consolidation during sleep, and deep learning for brain-computer interfaces.",
        "expertise": ["PAC Analysis", "Memory Consolidation", "LSTM", "Python", "MNE-Python"],
        "avatar": "/avatars/maria.png",
        "github": "",
        "publications": 8,
    },
    {
        "id": 3,
        "name": "Thomas Bauer",
        "role": "Senior Data Engineer",
        "bio": "Builds production-grade streaming pipelines on Databricks. Focus on Delta Live Tables, Unity Catalog governance, and CI/CD automation.",
        "expertise": ["DLT", "Unity Catalog", "GitHub Actions", "Structured Streaming", "XGBoost"],
        "avatar": "/avatars/thomas.png",
        "github": "",
        "publications": 3,
    },
]


@router.get("/", summary="Get all team members")
async def get_team():
    return TEAM


@router.get("/{member_id}", summary="Get a specific team member")
async def get_member(member_id: int):
    member = next((m for m in TEAM if m["id"] == member_id), None)
    if not member:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Team member not found")
    return member
