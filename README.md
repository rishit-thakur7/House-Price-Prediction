# House Price Prediction

This repository contains a simple machine-learning application with a FastAPI backend and a React/Vite frontend.

## Environment configuration

Sensitive or environment-specific values are stored in `.env` files which are ignored by Git.  Example files are provided in each directory:

- `backend/.env.example` – copy to `backend/.env` and update values
- `front end/.env.example` – copy to `front end/.env` or use `front end/.env.local`

Root `.gitignore` already excludes `.env`.

### Available variables

**backend**

| Variable | Description | Default |
|----------|-------------|---------|
| `MODEL_PATH` | Path to serialized model file | `model.pkl` |
| `ENCODER_PATH` | Path to label‑encoder | `encoder.pkl` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `*` |
| `PORT` | Uvicorn port | `8000` |

**frontend** (prefix with `VITE_`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL for backend API | `http://localhost:8000` |

## Running locally

### Backend

```bash
cd backend
python -m venv venv
pip install -r requirements.txt
# set environment variables or create .env
uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### Frontend

```bash
cd "front end"
npm install
# set VITE_API_URL in .env or environment
npm run dev
```

## Deployment

Refer to the main conversation notes for suggestions on containerization or hosting platforms.
