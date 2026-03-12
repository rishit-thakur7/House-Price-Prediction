import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LinearRegression
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

data_path = os.getenv("DATA_PATH", "data/house_price_india.csv")
df = pd.read_csv(data_path)

df = df[['city', 'bhk', 'area_sqft', 'price_in_inr']]

df = df.dropna()

df.columns = ['location', 'bhk', 'size', 'price']

encoder = LabelEncoder()
df['location'] = encoder.fit_transform(df['location'])

X = df[['location', 'bhk', 'size']]
y = df['price']

model = LinearRegression()
model.fit(X, y)

joblib.dump(model, 'model.pkl')
joblib.dump(encoder, 'encoder.pkl')

print("Model trained & saved")