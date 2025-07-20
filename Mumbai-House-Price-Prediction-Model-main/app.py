from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load the saved model
model = joblib.load("mumbai_model.pkl")

# Dummy encoding for city/location
city_encoding = {
    "Mumbai": 1.0,
    "Thane": 2.0,
    "Navi Mumbai": 3.0
}

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    print("Received data:", data)
    try:
        area = float(data["area"])
        bedrooms = int(data["bedrooms"])
        
        # Handle parking safely whether it's int or str
        parking_raw = data["parking"]
        if isinstance(parking_raw, str):
            parking = 0 if parking_raw.lower().strip() == "without parking" else 1
        else:
            parking = int(parking_raw)

        city = data["city"]
        
        # Temporary encoding logic for city (to avoid errors)
        city_mapping = {
            "mumbai": 0,
            "pune": 1,
            "bangalore": 2,
            "delhi": 3,
            "gorakhpur": 4,
            "jaipur": 5
        }
        city_encoded = city_mapping.get(city.lower().strip(), 0)

        features = [area, bedrooms, parking, city_encoded]
        prediction = model.predict([features])
        return jsonify({"prediction": round(prediction[0], 2)})
    except Exception as e:
        print("Prediction error:", str(e))
        return jsonify({"error": str(e)}), 400



if __name__ == "__main__":
    app.run(port=5000)
