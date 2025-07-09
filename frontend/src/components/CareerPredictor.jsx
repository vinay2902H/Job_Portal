import React, { useState } from 'react';

const CareerPredictor = () => {
    const [currentRole, setCurrentRole] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const isTextOnly = (str) => /^[A-Za-z\s,]+$/.test(str);

    const handlePredict = async () => {
        if (!currentRole.trim() || !skills.trim() || !experience) {
            setError('Please fill in all fields.');
            return;
        }

        if (!isTextOnly(currentRole)) {
            setError('Invalid Role.');
            return;
        }

        if (!isTextOnly(skills)) {
            setError('Invalid Skills.');
            return;
        }    

        setError('');
        try {
            const res = await fetch('http://localhost:5000/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_role: currentRole, skills, experience })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            setError('Failed to fetch prediction. Please try again.');
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 shadow rounded bg-white">
            <h2 className="text-2xl font-bold mb-4">Career Path Predictor</h2>
            <input
                type="text"
                placeholder="Current Role"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="border p-2 w-full mb-4"
            />
            <input
                type="text"
                placeholder="Skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="border p-2 w-full mb-4"
            />
            <input
                type="number"
                placeholder="Years of Experience"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border p-2 w-full mb-4"
            />
            {error && <p className="text-red-600 mb-2 font-medium">{error}</p>}
            <button
                onClick={handlePredict}
                className="bg-purple-600 text-white px-4 py-2 rounded"
            >
                Predict
            </button>
            {result && (
                <div className="mt-4 text-green-600">
                    <p><strong>Next Role:</strong> {result.predicted_next_role}</p>
                    <p><strong>Expected Salary:</strong> ₹{result.predicted_salary}</p>
                </div>
            )}
        </div>
    );
};

export default CareerPredictor;
