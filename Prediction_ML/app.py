from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)

# ✅ Allow both deployed frontend and local development
CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:5173",
    "https://jobportal-offical.netlify.app"
])

# Load ML models
try:
    career_model = joblib.load("career_path_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    salary_model = joblib.load("salary_model.pkl")
    print("✅ Models loaded successfully.")
except Exception as e:
    print("❌ Error loading models:", e)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Career Path Predictor Backend Running ✅"}), 200

@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    try:
        data = request.get_json()

        current_role = data.get("current_role", "")
        skills = data.get("skills", "")
        experience = data.get("experience", "0")

        if not current_role or not skills:
            return jsonify({"error": "Missing required fields"}), 400

        combined_input = current_role + " " + skills
        encoded_prediction = career_model.predict([combined_input])[0]
        predicted_role = label_encoder.inverse_transform([encoded_prediction])[0]

        try:
            experience_val = float(experience)
        except ValueError:
            return jsonify({"error": "Invalid experience value"}), 400

        predicted_salary = salary_model.predict([[experience_val]])[0]

        return jsonify({
            "predicted_next_role": predicted_role,
            "predicted_salary": round(predicted_salary)
        }), 200

    except Exception as e:
        print("❌ Prediction error:", e)
        return jsonify({"error": "Something went wrong on the server"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
