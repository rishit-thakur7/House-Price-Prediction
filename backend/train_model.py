import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

data_path = os.getenv("DATA_PATH", "data/house_price_india.csv")
df = pd.read_csv(data_path)

# Use price_in_lakhs directly — avoids the INR vs Lakhs confusion
df = df[['city', 'bhk', 'area_sqft', 'price_in_lakhs']].dropna()
df.columns = ['location', 'bhk', 'size', 'price']

encoder = LabelEncoder()
df['location_enc'] = encoder.fit_transform(df['location'])

X = df[['location_enc', 'bhk', 'size']]
y = df['price']

# GradientBoosting handles city-price relationships far better than LinearRegression
model = GradientBoostingRegressor(n_estimators=200, max_depth=5, random_state=42)
model.fit(X, y)

joblib.dump(model, 'model.pkl')
joblib.dump(encoder, 'encoder.pkl')

print("Model trained & saved")
print(f"Cities available: {encoder.classes_.tolist()}")

# Quick sanity check
mohali_enc = encoder.transform(['Mohali'])[0]
pred = model.predict([[mohali_enc, 1, 500]])[0]
print(f"Sanity check — Mohali 1BHK 500sqft: ₹{pred:.2f} Lakhs")