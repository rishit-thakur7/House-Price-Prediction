from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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
    return {"locations": sorted(encoder.classes_.tolist())}

@app.post("/predict")
def predict(data: HouseInput):
    try:
        loc = encoder.transform([data.location])[0]
    except ValueError:
        return {"error": f"Invalid city name '{data.location}'. Use /locations to see valid options."}

    # Model was trained on price_in_lakhs — result is already in lakhs
    price_lakhs = model.predict([[loc, data.bhk, data.size]])[0]
    price_inr = round(price_lakhs * 100_000, 2)

    return {
        "price_in_lakhs": round(float(price_lakhs), 2),
        "price_in_inr": price_inr,
        "location": data.location,
        "bhk": data.bhk,
        "size_sqft": data.size,
    }