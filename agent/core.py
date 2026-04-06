from config import settings
from tools.user_data import fetch_user_data
from tools.risk_model import predict_risk
from tools.explainability import explain_prediction
from tools.decision import decision_engine
from api.schemas import LoanApplicationRequest, AgentDecisionResponse
from utils.logger import get_logger

logger = get_logger(__name__)

def mock_llm_agent(app_data: LoanApplicationRequest) -> AgentDecisionResponse:
    """
    A lightweight mock agent that follows the Think -> Act -> Observe -> Decide loop manually
    without needing an actual LLM. Useful for local dev.
    """
    try:
        user_data = fetch_user_data(app_data.user_id)
        
        probability, confidence = predict_risk(
            income=app_data.income,
            credit_score=app_data.credit_score,
            dti=app_data.dti,
            employment_length=app_data.employment_length
        )
        
        explanation_data = explain_prediction(
            income=app_data.income,
            credit_score=app_data.credit_score,
            dti=app_data.dti,
            employment_length=app_data.employment_length
        )
        
        decision, heuristic_reasoning = decision_engine(
            probability,
            app_data.credit_score,
            app_data.dti,
            app_data.employment_length
        )
        
        reasoning = f"{heuristic_reasoning} Agent confidence in this recommendation is {confidence:.0%}."
                     
        return AgentDecisionResponse(
            risk_score=probability,
            confidence=confidence,
            decision=decision,
            explanation=reasoning,
            important_features=explanation_data
        )
    except Exception as e:
        logger.error(f"mock_llm_agent pipeline failed: {e}")
        raise RuntimeError(f"Agent Pipeline Error: {e}")

def openai_llm_agent(app_data: LoanApplicationRequest) -> AgentDecisionResponse:
    """
    Real LangChain implementation that uses OpenAI. 
    It defines tools and dynamically calls them.
    """
    from langchain_openai import ChatOpenAI
    from langchain.agents import initialize_agent, AgentType
    from langchain.tools import tool
    import json
    
    try:
        @tool
        def tool_fetch_user_data(user_id: str) -> str:
            """Fetch historical user data for the given user_id."""
            return json.dumps(fetch_user_data(user_id))
            
        @tool
        def tool_predict_risk(income: float, credit_score: int, dti: float, employment_length: int) -> str:
            """Predict probability of loan default and our confidence."""
            prob, conf = predict_risk(income, credit_score, dti, employment_length)
            return json.dumps({"probability": prob, "confidence": conf})
            
        @tool
        def tool_explain_prediction(income: float, credit_score: int, dti: float, employment_length: int) -> str:
            """Get SHAP explainability feature importances parsed to strings."""
            return json.dumps(explain_prediction(income, credit_score, dti, employment_length))
            
        @tool
        def tool_decision_engine(probability: float, credit_score: int, dti: float, employment_length: int) -> str:
            """Get the final Review/Approve/Reject decision and deterministic reasoning based on rules."""
            decision, reasoning = decision_engine(probability, credit_score, dti, employment_length)
            return json.dumps({"decision": decision, "reasoning": reasoning})

        tools = [tool_fetch_user_data, tool_predict_risk, tool_explain_prediction, tool_decision_engine]
        
        llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
        
        agent = initialize_agent(
            tools, 
            llm, 
            agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION, 
            verbose=True
        )
        
        prompt = f"""
        You are a Loan Underwriting AI Agent.
        Evaluate the following loan application:
        User ID: {app_data.user_id}
        Income: {app_data.income}
        Credit Score: {app_data.credit_score}
        DTI: {app_data.dti}
        Employment Length: {app_data.employment_length}
        
        You must:
        1. Predict the risk using tool_predict_risk.
        2. Get the explanations using tool_explain_prediction.
        3. Determine the decision using tool_decision_engine based on the risk.
        4. Formulate a final structured JSON output.
        
        Your explanation field must weave together the explicit `reasoning` generated from tool_decision_engine, the LLM's own insights, and the feature impacts.
        
        Your final answer must ONLY be valid JSON with the exact following schema:
        {{
            "risk_score": 0.00,
            "confidence": 0.00,
            "decision": "Approve/Reject/Review",
            "explanation": "Combined heuristic reasoning + LLM insights",
            "important_features": [ {{"feature": "name", "impact": "High positive impact"}} ]
        }}
        """
        
        res = agent.run(prompt)
        
        clean_res = res.strip().removeprefix("```json").removesuffix("```").strip()
        data = json.loads(clean_res)
        return AgentDecisionResponse(**data)
        
    except Exception as e:
        logger.error(f"openai_llm_agent pipeline failed: {e}")
        raise RuntimeError(f"Agent Pipeline Error: {e}")

class LoanAgent:
    @staticmethod
    def process_application(app_data: LoanApplicationRequest) -> AgentDecisionResponse:
        if settings.USE_LOCAL_LLM:
            return mock_llm_agent(app_data)
        else:
            return openai_llm_agent(app_data)
