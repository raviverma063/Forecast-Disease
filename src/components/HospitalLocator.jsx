'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // We'll need an input field
import { Loader2, Hospital, Map, Star, Clock } from 'lucide-react';

export default function HospitalLocator() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationQuery, setLocationQuery] = useState('Kanpur'); // Default search location

  const findHospitals = async () => {
    if (!locationQuery) {
      setError("Please enter a city or address.");
      return;
    }

    setLoading(true);
    setError(null);
    setHospitals([]);

    try {
      // Call our Python API with the user's typed location
      const response = await fetch(`/api/hospital_finder?query=${encodeURIComponent(locationQuery)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch nearby hospitals.');
      }
      const data = await response.json();
      setHospitals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hospital className="text-primary" />
          Hospital Locator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input 
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Enter city or address..."
          />
          <Button onClick={findHospitals} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Search'
            )}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="mt-4 space-y-3">
          {hospitals.map((hospital, index) => (
            <div key={index} className="p-3 bg-gray-800/50 rounded-lg">
              <h3 className="font-semibold text-white">{hospital.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{hospital.address}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400"/> {hospital.rating}</span>
                    <span className={`flex items-center gap-1 font-medium ${hospital.is_open === 'Open' ? 'text-green-400' : 'text-red-400'}`}><Clock size={12}/> {hospital.is_open}</span>
                </div>
                <a 
                  href={hospital.maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-400 hover:underline"
                >
                  <Map size={12}/> Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
