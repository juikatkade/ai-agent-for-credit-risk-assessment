from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
from utils.logger import get_logger

logger = get_logger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_instance = MongoDB()

async def connect_to_db():
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGO_URI}...")
        db_instance.client = AsyncIOMotorClient(settings.MONGO_URI)
        db_instance.db = db_instance.client[settings.MONGODB_DB_NAME]
        logger.info("Successfully connected to MongoDB.")
    except Exception as e:
        logger.error(f"Error connecting to MongoDB: {e}")
        raise e

async def close_db_connection():
    if db_instance.client:
        logger.info("Closing MongoDB connection.")
        db_instance.client.close()

def get_db():
    return db_instance.db
