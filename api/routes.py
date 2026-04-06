from fastapi import APIRouter, HTTPException, BackgroundTasks
from api.schemas import LoanApplicationRequest, AgentDecisionResponse, LoggedDecision
from agent.core import LoanAgent
from agent.memory import save_decision, get_similar_decisions
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()

@router.get("/health")
async def health_check():
    return {"status": "ok", "message": "Autonomous Credit Underwriting Agent is running."}

@router.post("/analyze-loan", response_model=AgentDecisionResponse)
async def analyze_loan(application: LoanApplicationRequest, background_tasks: BackgroundTasks):
    try:
        logger.info(f"Processing loan application for user: {application.user_id}")
        
        # Log similar decisions for contextual visibility
        similar_past = await get_similar_decisions(application.credit_score)
        if similar_past:
            logger.info(f"Found {len(similar_past)} similar past decisions: {similar_past}")
        
        # Fast processing via the agent
        try:
            decision: AgentDecisionResponse = LoanAgent.process_application(application)
        except RuntimeError as agent_err:
            logger.error(f"Agent internally failed: {agent_err}")
            raise HTTPException(status_code=500, detail=str(agent_err))
            
        logger.info(f"Agent decision for {application.user_id}: {decision.decision} with confidence: {decision.confidence:.2f}")
        
        # Prepare the log data
        logged_data = LoggedDecision(
            user_id=application.user_id,
            application_data=application.model_dump(),
            risk_score=decision.risk_score,
            confidence=decision.confidence,
            decision=decision.decision,
            explanation=decision.explanation,
            important_features=decision.important_features
        )
        
        # We can save to MongoDB in the background to not block the API response
        background_tasks.add_task(save_decision, logged_data)
        
        return decision
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unhandled error processing loan application: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during loan analysis.")
