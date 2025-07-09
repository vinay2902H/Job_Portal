import pandas as pd
import joblib
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder

# Load dataset
df = pd.read_csv("career_data.csv")

# Combine features
df.dropna(subset=["current_role", "skills", "experience_years", "next_role", "salary"], inplace=True)
df["combined"] = df["current_role"] + " " + df["skills"]

# Encode target for next_role prediction
le = LabelEncoder()
df["next_role_encoded"] = le.fit_transform(df["next_role"])

# Classification pipeline for next role
clf_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer()),
    ("clf", RandomForestClassifier(n_estimators=100, random_state=42))
])
clf_pipeline.fit(df["combined"], df["next_role_encoded"])
joblib.dump(clf_pipeline, "career_path_model.pkl")
joblib.dump(le, "label_encoder.pkl")

# Regression model for salary prediction
reg_pipeline = Pipeline([
    ("reg", RandomForestRegressor(n_estimators=100, random_state=42))
])
reg_pipeline.fit(df[["experience_years"]], df["salary"])
joblib.dump(reg_pipeline, "salary_model.pkl")

print("✅ Models trained and saved.")
