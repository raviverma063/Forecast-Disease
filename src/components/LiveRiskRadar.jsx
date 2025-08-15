'use client';

import React, { useState, useEffect } from 'react';

// --- Mock Outbreak Data ---
// The "Default" section now contains all three risk levels and will be shown for any district.
const outbreakData = {
  "Default": [
    {
      level: 'Immediate',
      title: 'Dengue Fever Spike',
      whyLabel: 'Why Urgent',
      whyText: 'Dengue cases in your locality are rising with the season. Mosquito breeding is common in this weather.',
      actionLabel: 'Action — Do This Today',
      actions: [
        { emoji: '🦟', text: 'Apply mosquito repellent (DEET 20%) morning + evening.' },
        { emoji: '👖', text: 'Wear full sleeves + trousers during 6–9 PM peak mosquito activity.' },
        { emoji: '🚫', text: 'Remove all standing water at home now.' },
        { emoji: '🧾', text: 'Monitor for fever + headache + rash → test within 24 hrs.' },
      ],
    },
    {
      level: 'High',
      title: 'Seasonal Influenza Surge',
      whyLabel: 'Why Important',
      whyText: 'Rain + humidity is increasing flu virus spread across the region.',
      actionLabel: 'Action This Week',
      actions: [
        { emoji: '😷', text: 'Wear mask in crowded indoor areas.' },
        { emoji: '🧴', text: 'Wash hands frequently with soap/sanitizer.' },
        { emoji: '💉', text: 'If not vaccinated in last 12 months → get flu shot within 3 days.' },
      ],
    },
    {
      level: 'Moderate',
      title: 'Acute Gastroenteritis',
      whyLabel: 'Why Notable',
      whyText: 'Risk of waterborne diarrhea increases during this season.',
      actionLabel: 'Action in Next 48 hrs',
      actions: [
        { emoji: '💧', text: 'Drink only boiled/RO water.' },
        { emoji: '🥗', text: 'Avoid street food, especially during rains.' },
        { emoji: '🧪', text: 'If diarrhea + fever → stool test & oral rehydration immediately.' },
      ],
    },
  ],
  // Specific, curated data for certain districts can still override the default.
  "Kanpur Nagar": [
    {
      level: 'Immediate',
      title: 'Dengue Fever Spike',
      whyLabel: 'Why Urgent',
      whyText: 'Dengue cases in Kanpur Nagar ↑ 42% this week, mosquito breeding reported within 500 m radius.',
      actionLabel: 'Action — Do This Today',
      actions: [
        { emoji: '🦟', text: 'Apply mosquito repellent (DEET 20%) morning + evening.' },
        { emoji: '👖', text: 'Wear full sleeves + trousers during 6–9 PM peak mosquito activity.' },
        { emoji: '🚫', text: 'Remove all standing water at home now.' },
        { emoji: '🧾', text: 'Monitor for fever + headache + rash → test within 24 hrs.' },
      ],
    },
    {
      level: 'High',
      title: 'Seasonal Influenza Surge',
      whyLabel: 'Why Important',
      whyText: 'Rain + humidity increasing flu virus spread; local OPD cases up 27% in past week.',
      actionLabel: 'Action This Week',
      actions: [
        { emoji: '😷', text: 'Wear mask in crowded indoor areas.' },
        { emoji: '🧴', text: 'Wash hands frequently with soap/sanitizer.' },
        { emoji: '💉', text: 'If not vaccinated in last 12 months → get flu shot within 3 days.' },
      ],
    },
    {
      level: 'Moderate',
      title: 'Acute Gastroenteritis',
      whyLabel: 'Why Notable',
      whyText: 'Multiple waterborne diarrhea cases reported from nearby wards.',
      actionLabel: 'Action in Next 48 hrs',
      actions: [
        { emoji: '💧', text: 'Drink only boiled/RO water.' },
        { emoji: '🥗', text: 'Avoid street food during rains.' },
        { emoji: '🧪', text: 'If diarrhea + fever → stool test & oral rehydration immediately.' },
      ],
    },
  ],
  "Lucknow": [
     {
      level: 'Immediate',
      title: 'Viral Conjunctivitis (Eye Flu) Outbreak',
      whyLabel: 'Why Urgent',
      whyText: 'A significant surge in Eye Flu cases has been reported across Lucknow, spreading rapidly in schools and offices.',
      actionLabel: 'Action — Do This Today',
      actions: [
        { emoji: '👁️', text: 'Avoid touching your eyes. Wash hands frequently.' },
        { emoji: '🚫', text: 'Do not share towels, pillows, or eye makeup.' },
        { emoji: '👓', text: 'Wear protective glasses if in crowded places.' },
        { emoji: '👨‍⚕️', text: 'If you have redness, itching, or discharge, consult a doctor immediately.' },
      ],
    },
    {
      level: 'High',
      title: 'Typhoid Fever Advisory',
      whyLabel: 'Why Important',
      whyText: 'Contaminated water sources in several parts of Lucknow have led to an increase in Typhoid cases.',
      actionLabel: 'Action This Week',
      actions: [
        { emoji: '💧', text: 'Ensure all drinking water is boiled or from a reliable purifier.' },
        { emoji: '🍲', text: 'Eat well-cooked food. Avoid raw salads and street food.' },
        { emoji: '💉', text: 'Get vaccinated for Typhoid if you haven\'t already.' },
      ],
    },
  ],
  "Agra": [
    {
      level: 'High',
      title: 'Heatstroke Advisory',
      whyLabel: 'Why Important',
      whyText: 'Extreme temperatures above 42°C are forecasted for the next 72 hours, increasing the risk of heat-related illnesses.',
      actionLabel: 'Action This Week',
      actions: [
        { emoji: '�', text: 'Drink plenty of water, even if not thirsty. Avoid alcohol and caffeine.' },
        { emoji: '☀️', text: 'Stay indoors during peak heat hours (11 AM - 4 PM).' },
        { emoji: '👕', text: 'Wear lightweight, light-colored, loose-fitting clothing.' },
      ],
    },
    {
      level: 'Moderate',
      title: 'Foodborne Illness Alert',
      whyLabel: 'Why Notable',
      whyText: 'An increase in food poisoning cases has been linked to street vendors in tourist-heavy areas.',
      actionLabel: 'Action in Next 48 hrs',
      actions: [
        { emoji: '🥗', text: 'Avoid raw or undercooked street food, especially meat and dairy.' },
        { emoji: '🧴', text: 'Carry and use hand sanitizer before eating.' },
        { emoji: '👨‍⚕️', text: 'If you experience vomiting or diarrhea, seek medical attention.' },
      ],
    },
  ],
  "Varanasi": [
    {
      level: 'High',
      title: 'Cholera & Waterborne Disease Warning',
      whyLabel: 'Why Important',
      whyText: 'Recent flooding has increased the risk of water contamination from the Ganges. Multiple Cholera cases reported.',
      actionLabel: 'Action This Week',
      actions: [
        { emoji: '💧', text: 'Drink and use only boiled, bottled, or properly treated water.' },
        { emoji: '🚫', text: 'Avoid bathing or wading in floodwaters.' },
        { emoji: '🧼', text: 'Wash hands thoroughly with soap after contact with river water.' },
      ],
    },
     {
      level: 'Moderate',
      title: 'Leptospirosis Risk',
      whyLabel: 'Why Notable',
      whyText: 'Contact with contaminated water or soil can lead to Leptospirosis. Risk is elevated due to waterlogging.',
      actionLabel: 'Action in Next 48 hrs',
      actions: [
        { emoji: '👢', text: 'Wear waterproof boots if you must walk through waterlogged areas.' },
        { emoji: '🩹', text: 'Cover any cuts or wounds with waterproof dressings.' },
        { emoji: '🐶', text: 'Be cautious around stray animals that may carry the bacteria.' },
      ],
    },
  ],
};

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

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    let currentDistrict = 'Default';

    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      currentDistrict = profileData.currentDistrict || 'Default';
    }

    const districtRisks = outbreakData[currentDistrict] || outbreakData['Default'];
    setRisks(districtRisks);
    setLoading(false);
  }, []);

  if (loading) {
    return (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p>Loading Personalized Risk Data...</p>
        </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">🔴 Live Disease Risk Radar</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2 text-sm font-semibold text-gray-400">Risk Level</th>
              <th className="p-2 text-sm font-semibold text-gray-400">Threat</th>
              <th className="p-2 text-sm font-semibold text-gray-400">Key Action</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk, index) => (
              <tr key={index} className="border-b border-gray-700 last:border-b-0">
                <td className={`p-3 font-semibold whitespace-nowrap ${getRiskColor(risk.level)}`}>
                  <span className="mr-2">{getRiskIcon(risk.level)}</span>
                  {risk.level}
                </td>
                <td className="p-3 text-white font-medium">{risk.title}</td>
                <td className="p-3 text-gray-300 text-sm">
                  {risk.actions[0].emoji} {risk.actions[0].text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
�
