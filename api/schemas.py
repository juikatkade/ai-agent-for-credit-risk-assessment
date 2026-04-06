from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class LoanApplicationRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the user")
    income: float = Field(..., gt=0, description="Annual income of the applicant")
    credit_score: int = Field(..., ge=300, le=900, description="Credit score (300-900)")
    dti: float = Field(..., ge=0, le=1, description="Debt to income ratio (0 to 1)")
    employment_length: int = Field(..., ge=0, description="Employment length in years")

class FeatureImpact(BaseModel):
    feature: str
    impact: str

class AgentDecisionResponse(BaseModel):
    risk_score: float = Field(..., description="Probability of default")
    confidence: float = Field(..., description="Agent confidence score")
    decision: str = Field(..., description="Approve, Reject, or Review")
    explanation: str = Field(..., description="Natural language reasoning")
    important_features: List[FeatureImpact] = Field(..., description="Key features and their impacts")

class LoggedDecision(AgentDecisionResponse):
    user_id: str
    application_data: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)
