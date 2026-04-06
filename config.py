from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    USE_LOCAL_LLM: bool = True
    OPENAI_API_KEY: str = ""
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "loan_agent_db"
    FRONTEND_ORIGIN: str = "http://localhost:5173"

    # ✅ ADD THESE
    THRESHOLD_APPROVE: float = 0.4
    THRESHOLD_REJECT: float = 0.7

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
