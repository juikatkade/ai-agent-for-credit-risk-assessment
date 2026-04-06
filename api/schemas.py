from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime

class LoanApplicationRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the user")
    income: float = Field(..., gt=0, description="Annual income of the applicant")
    credit_score: int = Field(..., ge=300, le=900, description="Credit score (300-900)")
    dti: float = Field(..., ge=0, le=1, description="Debt to income ratio (0 to 1)")
    employment_length: int = Field(..., ge=0, description="Employment length in years (time at current job)")
    loan_tenure: Optional[int] = Field(default=None, ge=1, le=30, description="Requested loan term in years")
    currency: Optional[str] = Field(default="USD", description="Currency type: USD or INR")

class UserProfile(BaseModel):
    user_id: str
    name: str
    email: str
    phone: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    total_applications: int = 0
    approved_count: int = 0
    rejected_count: int = 0
    review_count: int = 0

class FeatureImpact(BaseModel):
    feature: str
    impact: str

class AgentDecisionResponse(BaseModel):
    risk_score: float = Field(..., description="Probability of default")
    confidence: float = Field(..., description="Agent confidence score")
    decision: str = Field(..., description="Approve, Reject, or Review")
    explanation: str = Field(..., description="Natural language reasoning")
    important_features: List[FeatureImpact] = Field(..., description="Key features and their impacts")

class DownloadReportRequest(BaseModel):
    user_id: str
    income: float
    credit_score: int
    dti: float
    employment_length: int
    loan_tenure: Optional[int] = None
    currency: Optional[str] = "USD"
    risk_score: float
    confidence: float
    decision: str
    explanation: str
    important_features: List[FeatureImpact]

class LoggedDecision(AgentDecisionResponse):
    user_id: str
    application_data: dict
    timestamp: datetime = Field(default_factory=datetime.utcnow)
