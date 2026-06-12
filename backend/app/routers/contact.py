"""Contact router — handles contact form submissions."""
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.database import get_database

router = APIRouter()


class ContactRequest(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    interest: str = "general"  # general | collaboration | phd | other


class ContactResponse(BaseModel):
    success: bool
    message: str
    id: str | None = None


@router.post("/", response_model=ContactResponse, summary="Submit contact form")
async def submit_contact(payload: ContactRequest):
    """Save contact form submission to MongoDB."""
    try:
        db = get_database()
        doc = {
            **payload.model_dump(),
            "created_at": datetime.utcnow(),
            "status": "new",
        }
        result = await db["contacts"].insert_one(doc)
        return ContactResponse(
            success=True,
            message="Thank you! We will get back to you within 48 hours.",
            id=str(result.inserted_id),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save contact: {str(e)}")
