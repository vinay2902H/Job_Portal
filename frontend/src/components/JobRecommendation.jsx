import { useState } from "react";
import axios from "axios";

const JobRecommendations = () => {
  const [skills, setSkills] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getRecommendations = async () => {
    if (!skills.trim()) {
      setError("Please enter some skills.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/v1/job/recommend-jobs", { skills });
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch job recommendations. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-3">Job Recommendations</h2>
      
      <input
        type="text"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="Enter skills (e.g., React, Python, ML)"
        className="w-full p-2 border rounded-lg"
      />
      
      <button
        onClick={getRecommendations}
        className="mt-3 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Jobs"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <ul className="mt-4">
        {jobs.map((job) => (
          <li key={job.id} className="border-b p-2">
            <strong>{job.title}</strong> - {job.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobRecommendations;
