'use client';

import React, { useState, useEffect } from 'react';

// --- Helper Functions for Display ---
const getRiskColor = (level) => {
  switch (level) {
    case 'Immediate': return 'text-red-400';
    case 'High': return 'text-orange-400';
    case 'Moderate': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
};

const getRiskIcon = (level) => {
    switch (level) {
      case 'Immediate': return '🚨';
      case 'High': return '🟠';
      case 'Moderate': return '🟡';
      default: return '⚪️';
    }
  };

export default function LiveRiskRadar() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskData = async () => {
      try {
        const savedProfile = localStorage.getItem('userProfile');
        const profileData = savedProfile ? JSON.parse(savedProfile) : {};

        const baseUrl = window.location.origin;
        const apiUrl = new URL('/api/predictor', baseUrl).toString();

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileData),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch risk data from the server.');
        }

        const data = await response.json();
        setRisks(data);
        setError(null);

      } catch (err) {
        console.error(err);
        setError('Could not load live risk data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRiskData();
  }, []);

  if (loading) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p>Loading Personalized Risk Data...</p>
        </div>
    );
  }

  if (error) {
     return (
        <div className="bg-gray-800 p-6 rounded-lg text-center text-red-400">
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
        <span className="text-red-500">🔴</span> Live Disease Risk Radar
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-3 text-sm font-semibold text-gray-400">Risk Level</th>
              <th className="p-3 text-sm font-semibold text-gray-400">Threat</th>
              <th className="p-3 text-sm font-semibold text-gray-400">Most Important Action</th>
            </tr>
          </thead>
          <tbody>
            {risks.length > 0 ? (
              risks.map((risk, index) => (
                <tr key={index} className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700/50 transition-colors">
                  <td className={`p-3 font-semibold whitespace-nowrap ${getRiskColor(risk.level)}`}>
                    <span className="mr-2">{getRiskIcon(risk.level)}</span>
                    {risk.level}
                  </td>
                  <td className="p-3 text-white font-medium">{risk.title}</td>
                  <td className="p-3 text-gray-300 text-sm">
                    {/* We display only the first and most critical action */}
                    {risk.actions[0].emoji} {risk.actions[0].text}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-400">
                  No immediate threats detected for your profile and location.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
