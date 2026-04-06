import xgboost as xgb
import pandas as pd
import numpy as np
import pickle
import os

# Create dummy data
np.random.seed(42)
n_samples = 1000

# Features: income (20k - 200k), credit_score (300 - 850), dti (0.01 - 0.6), employment_length (0-40)
income = np.random.uniform(20000, 200000, n_samples)
credit_score = np.random.randint(300, 850, n_samples)
dti = np.random.uniform(0.01, 0.6, n_samples)
employment_length = np.random.randint(0, 40, n_samples)

# Simplified logic to generate targets (1 = Default, 0 = Paid)
# Lower credit score, higher dti -> more likely to default
risk_score = (850 - credit_score)/550 + 2*dti - income/400000
probabilities = 1 / (1 + np.exp(-(risk_score - np.mean(risk_score))))
target = (probabilities > 0.6).astype(int)

df = pd.DataFrame({
    'income': income,
    'credit_score': credit_score,
    'dti': dti,
    'employment_length': employment_length
})

# Train model
model = xgb.XGBClassifier(n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42)
model.fit(df, target)

# Save model
os.makedirs('models', exist_ok=True)
with open('models/dummy_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("Dummy XGBoost model trained and saved to models/dummy_model.pkl")
