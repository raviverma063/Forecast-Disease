'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Hospital, Map, Star, Clock } from 'lucide-react';

export default function HospitalLocator() {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findHospitals = () => {
    setLoading(true);
    setError(null);
    setHospitals([]);

    // --- STRATEGY 1: Try to get live GPS location first ---
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // GPS Success: Fetch hospitals using coordinates
          const { latitude, longitude } = position.coords;
          fetchHospitalsByGps(latitude, longitude);
        },
        () => {
          // GPS Failed: Fall back to using the profile data
          console.log("GPS failed, falling back to profile.");
          fetchHospitalsByProfile();
        }
      );
    } else {
      // Geolocation not supported: Go straight to profile data
      console.log("Geolocation not supported, falling back to profile.");
      fetchHospitalsByProfile();
    }
  };
  
  const fetchHospitalsByGps = async (lat, lng) => {
     try {
        const response = await fetch(`/api/hospital_finder?lat=${lat}&lng=${lng}`);
        if (!response.ok) throw new Error('Failed to fetch hospitals via GPS.');
        const data = await response.json();
        setHospitals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
  };

  const fetchHospitalsByProfile = async () => {
    // --- STRATEGY 2: Use the saved profile district ---
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      const district = profileData.currentDistrict;
      if (district) {
         try {
            const response = await fetch(`/api/hospital_finder?query=${encodeURIComponent(district)}`);
            if (!response.ok) throw new Error('Failed to fetch hospitals using profile.');
            const data = await response.json();
            setHospitals(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
          return;
      }
    }

    // --- FINAL FALLBACK ---
    setError("Could not find location. Please set your district in your profile.");
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Hospital className="text-primary" />
          Nearby Hospital Locator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={findHospitals} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Hospitals Near You...
            </>
          ) : (
            'Find Hospitals Near Me'
          )}
        </Button>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

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
