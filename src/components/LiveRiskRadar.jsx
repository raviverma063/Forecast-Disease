'use client';

import React, { useState, useEffect } from 'react';

// --- Helper Functions for Display ---
const getRiskColor = (level) => {
  switch (level) {
    case 'Immediate': return 'border-red-500';
    case 'High': return 'border-orange-500';
    case 'Moderate': return 'border-yellow-500';
    default: return 'border-gray-500';
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
      <h2 className="text-xl font-bold mb-2 text-white">🔴 Live Disease Risk Radar — Personalized Alerts</h2>
      <p className="text-sm text-gray-400 mb-6">(Auto-updates daily based on outbreak data, weather, and your profile)</p>

      {risks.length > 0 ? (
        <div className="space-y-6">
          {risks.map((risk, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${getRiskColor(risk.level)} bg-gray-900/50`}>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                {getRiskIcon(risk.level)} {risk.level} Threat: {risk.title}
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                <span className="font-semibold">{risk.whyLabel}:</span> {risk.whyText}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold text-white">{risk.actionLabel}:</h4>
                <ul className="list-none space-y-2 mt-2 text-sm text-gray-300">
                  {risk.actions.map((action, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-lg">{action.emoji}</span>
                      <span>{action.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-4">
          <p>No immediate threats detected for your profile and location.</p>
        </div>
      )}
    </div>
  );
}
