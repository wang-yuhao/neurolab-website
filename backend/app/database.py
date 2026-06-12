"""Motor (async MongoDB) connection manager."""
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

_client: AsyncIOMotorClient | None = None


async def connect_db() -> None:
    global _client
    _client = AsyncIOMotorClient(settings.mongo_url)
    print(f"Connected to MongoDB: {settings.mongo_url}")


async def close_db() -> None:
    global _client
    if _client:
        _client.close()
        print("MongoDB connection closed")


def get_database():
    """Return the database handle."""
    if _client is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _client[settings.mongo_db]
