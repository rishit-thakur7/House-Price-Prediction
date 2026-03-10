from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")
encoder = joblib.load("encoder.pkl")

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