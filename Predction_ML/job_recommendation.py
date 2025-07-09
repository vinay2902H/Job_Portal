from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pymongo

app = Flask(__name__)
CORS(app)

# MongoDB connection
client = pymongo.MongoClient("mongodb+srv://vinay:vinay123@cluster0.fqol9.mongodb.net/test?retryWrites=true&w=majority")
db = client["test"]
job_collection = db["jobs"]

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_input = data.get('skills', '')

    if not user_input:
        return jsonify([])

    jobs = list(job_collection.find({}))
    job_texts = [f"{job.get('title', '')} {job.get('description', '')} {' '.join(job.get('requirements', []))}" for job in jobs]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_input] + job_texts)
    similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    top_indices = similarities.argsort()[::-1][:10]
    recommendations = [jobs[i] for i in top_indices if similarities[i] > 0.2]

    for job in recommendations:
        job['_id'] = str(job['_id'])

    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
