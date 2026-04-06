# 🤖 AI Loan Underwriting Agent

A full-stack AI-powered system for **credit risk assessment and instant loan decisioning** using Machine Learning, Explainable AI, and an autonomous agent architecture.

---

## 🚀 Features

* 🧠 AI Agent-based decision system (Think → Act → Decide)
* 📊 Credit risk prediction using ML models
* 🔍 Explainable AI (SHAP-based insights)
* ⚡ Real-time loan underwriting API
* 🌐 Full-stack web application (React + FastAPI)
* 🗄️ MongoDB integration for storing decisions
* 🎨 Modern fintech-style UI (dark theme + glassmorphism)

---

## 🏗️ Tech Stack

### 🔧 Backend

* FastAPI
* Python
* Scikit-learn / XGBoost
* SHAP (Explainability)
* MongoDB (Motor - async)

### ⚛️ Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Router

### ☁️ Deployment

* Render (Frontend + Backend)
* MongoDB Atlas (Cloud Database)

---

## 🧠 System Architecture

```text
User → React Frontend → FastAPI Backend → AI Agent → ML Model + SHAP → Decision → MongoDB
```

---


## ⚙️ Installation (Local Setup)

### 1. Clone Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Create `.env` file:

```env
MONGO_URI=your_local_or_atlas_uri
FRONTEND_ORIGIN=http://localhost:5173
USE_LOCAL_LLM=true
```

Run backend:

```bash
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoint

### POST `/analyze-loan`

#### Request:

```json
{
  "user_id": "test_user",
  "income": 85000,
  "credit_score": 680,
  "dti": 0.25,
  "employment_length": 3
}
```

#### Response:

```json
{
  "risk_score": 0.05,
  "confidence": 0.95,
  "decision": "Approve",
  "explanation": "Low risk due to strong financial indicators",
  "important_features": [
    { "feature": "credit_score", "impact": "High positive impact" }
  ]
}
```

---

## 🔐 Authentication (Planned)

* Login / Signup UI implemented
* Backend authentication (JWT) can be added

---

## 📈 Future Enhancements

* 🔐 JWT Authentication & user accounts
* 📊 Dashboard analytics & charts
* 🤖 Multi-agent system
* ☁️ CI/CD pipeline
* 📱 Mobile responsiveness improvements

---

## 💡 Key Highlights

* Combines ML + AI agent architecture
* Interpretable decision-making (not black-box)
* Production-ready backend design
* Clean modular frontend UI

---

## 🧑‍💻 Author

**Jui Katkde**

* GitHub: https://github.com/juikatkade

---

## ⭐ If you like this project

Give it a star ⭐ and share!
