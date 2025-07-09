import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const Browse = () => {
  useGetAllJobs(); // Fetch all jobs on page load
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  const { allJobs } = useSelector((store) => store.job);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Filter jobs based on title/desc/skills
  useEffect(() => {
    dispatch(setSearchedQuery(searchQuery));
    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      const filtered = allJobs.filter(job =>
        job.title?.toLowerCase().includes(lower) ||
        job.description?.toLowerCase().includes(lower) ||
        job.skills?.some(skill => skill.toLowerCase().includes(lower))
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(allJobs);
    }
  }, [searchQuery, allJobs]);

  // 🤖 Fetch recommended jobs using ML
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!searchQuery) return;
      try {
        setLoading(true);
        const res = await axios.post('http://localhost:8000/recommend', {
          skills: searchQuery,
          excludeIds: filteredJobs.map(job => job._id),
        });
        setRecommendedJobs(res.data || []);
      } catch (err) {
        console.error("ML Recommendation error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [searchQuery, filteredJobs]);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto my-10'>
        <h1 className='font-bold text-xl mb-6'>Search Results for "{searchQuery}"</h1>

        {/* 🔍 Filtered Jobs */}
        <h2 className="text-lg font-semibold mb-2">Filtered Jobs ({filteredJobs.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {filteredJobs.map((job) => (
            <Job key={job._id} job={job} />
          ))}
        </div>

        {/* 🤖 ML-Based Recommendations */}
        {recommendedJobs.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Recommended Jobs ({recommendedJobs.length})</h2>
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-2">
                {recommendedJobs.map((job) => {
                  const normalizedJob = {
                    _id: job._id || job.id,
                    title: job.title || 'Untitled',
                    description: job.description || 'No description provided.',
                    location: job.location || 'Not specified',
                    salary: job.salary || 0,
                    company: job.company || 'Unknown',
                    jobType: job.jobType || 'N/A',
                    experienceLevel: job.experienceLevel || 0,
                    requirements: Array.isArray(job.requirements)
                      ? job.requirements
                      : job.requirements?.split?.(/[,\s]+/) || [],
                  };

                  return (
                    <div key={normalizedJob._id} className="min-w-[300px] flex-shrink-0">
                      <Job job={normalizedJob} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 🕐 Loading Indicator */}
        {loading && (
          <div className="text-center text-sm text-gray-500 mt-4">
            Fetching smart job recommendations...
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
