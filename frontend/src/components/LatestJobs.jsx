import React from 'react';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector((store) => store.job);

    return (
        <div className='max-w-7xl mx-auto my-20 px-4'>
            <h1 className='text-4xl font-bold mb-6'>
                <span className='text-[#6A38C2]'>Top 3 Highest Paying Job Openings</span> 
            </h1>

            {allJobs?.length <= 0 ? (
                <div className='text-center text-gray-500'>No Job Available</div>
            ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {
                        [...allJobs]
                            .sort((a, b) => b.salary - a.salary) // Sort by salary descending
                            .slice(0, 3) // Only take top 3
                            .map((job) => (
                                <LatestJobCards key={job._id} job={job} />
                            ))
                    }
                </div>
            )}
        </div>
    );
};

export default LatestJobs;
