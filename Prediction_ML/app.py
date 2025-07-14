from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)

#  Allow both local and deployed frontend URLs
CORS(app, resources={r"/predict": {"origins": [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://jobportal-offical.netlify.app"
]}})

#  Load models safely
try:
    career_model = joblib.load("career_path_model.pkl")
    label_encoder = joblib.load("label_encoder.pkl")
    salary_model = joblib.load("salary_model.pkl")
    print(" Models loaded successfully.")
except Exception as e:
    print(" Error loading models:", e)

#  Health check route
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Career Path Predictor Backend Running "}), 200

#  Prediction route with CORS + preflight
@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    if request.method == "OPTIONS":
        # Handle preflight (CORS)
        return jsonify({"message": "Preflight OK"}), 200

    try:
        data = request.get_json()

        current_role = data.get("current_role", "")
        skills = data.get("skills", "")
        experience = data.get("experience", "0")

        if not current_role.strip() or not skills.strip():
            return jsonify({"error": "Missing current_role or skills"}), 400

        # Combine role and skills for prediction
        combined_input = current_role + " " + skills

        # Predict next role
        encoded_prediction = career_model.predict([combined_input])[0]
        predicted_role = label_encoder.inverse_transform([encoded_prediction])[0]

        # Predict salary
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
        print(" Prediction error:", e)
        return jsonify({"error": "Something went wrong on the server"}), 500

#  Run the server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
