from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
from dotenv import load_dotenv

# load environment variables from .env (if present)
load_dotenv()

app = FastAPI()

# configure CORS origins via environment variable (comma‑separated), default to all
cors_origins = os.getenv("CORS_ORIGINS", "*")
allow_origins = [o.strip() for o in cors_origins.split(",")] if cors_origins != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_path = os.getenv("MODEL_PATH", "model.pkl")
encoder_path = os.getenv("ENCODER_PATH", "encoder.pkl")

model = joblib.load(model_path)
encoder = joblib.load(encoder_path)

class HouseInput(BaseModel):
    location: str
    bhk: int
    size: float

@app.get("/")
def home():
    return {"status": "ok"}

@app.get("/locations")
def get_locations():
    return {"locations": encoder.classes_.tolist()}

@app.post("/predict")
def predict(data: HouseInput):
    try:
        loc = encoder.transform([data.location])[0]
    except:
        return {"error": "Invalid city name"}

    price = model.predict([[loc, data.bhk, data.size]])[0]
    return {"price": round(float(price), 2)}