import React from "react";

const JobCard = ({ job }) => {
    return (
        <div className="border p-4 rounded-md shadow-md flex items-center space-x-4">
            
            {/* Company Logo */}
            {job.logo && (
                <img 
                    src={job.logo} 
                    alt={`${job.company} Logo`} 
                    className="w-16 h-16 object-cover rounded-md"
                />
            )}

            {/* Job Details */}
            <div>
                <h2 className="text-lg font-bold">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
                <p className="text-gray-700">{job.description}</p>

                {/* Salary */}
                <p className="mt-2 font-semibold text-green-600">
                    Salary: {job.salary ? `$${job.salary}/year` : "Not disclosed"}
                </p>
            </div>
        </div>
    );
};

export default JobCard;
