import React, { useEffect, useState } from 'react';
//import Navbar from '../shared/Navbar';
import Job from '../components/Job';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(jobs);
  }, []);

  return (
    <div>
      
      <div className="max-w-6xl mx-auto p-5">
        <h1 className="text-2xl font-bold mb-4">Saved Jobs</h1>
        {savedJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {savedJobs.map(job => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No saved jobs yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
