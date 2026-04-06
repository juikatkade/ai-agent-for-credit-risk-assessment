import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.routes import router
from utils.db import connect_to_db, close_db_connection
from utils.logger import get_logger
from config import settings
import uvicorn

logger = get_logger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up application...")
    await connect_to_db()
    yield
    # Shutdown
    logger.info("Shutting down application...")
    await close_db_connection()

app = FastAPI(
    title="Autonomous Credit Risk Agent API",
    description="An AI agent backend for analyzing loan risk.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
