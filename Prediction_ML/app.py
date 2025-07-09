from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

# Load models
career_model = joblib.load("career_path_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")
salary_model = joblib.load("salary_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    current_role = data.get("current_role", "")
    skills = data.get("skills", "")
    experience = data.get("experience", "0")

    # Combine inputs
    combined = current_role + " " + skills

    # Predict next role
    encoded_pred = career_model.predict([combined])[0]
    predicted_next_role = label_encoder.inverse_transform([encoded_pred])[0]

    # Predict salary
    try:
        experience_val = float(experience)
    except ValueError:
        return jsonify({"error": "Invalid experience value"}), 400

    predicted_salary = salary_model.predict([[experience_val]])[0]

    return jsonify({
        "predicted_next_role": predicted_next_role,
        "predicted_salary": round(predicted_salary)
    })

if __name__ == "__main__":
    app.run(debug=True)
