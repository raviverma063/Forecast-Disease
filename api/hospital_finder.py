"use client"

import React, { useState } from "react";

// Main component for the hospital locator application
const HospitalLocator = () => {
  // State variables for managing the UI and data
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * Fetches nearby hospitals using the user's current location.
   * It handles geolocation, API calls, and error handling.
   */
  const findHospitals = () => {
    // Check if the Geolocation API is supported by the browser
    if (navigator.geolocation) {
      setLoading(true); // Start loading state
      setError(""); // Clear previous errors
      setHospitals([]); // Clear previous hospital list

      // Attempt to get the user's current position with a timeout
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Now, we make the API call to the Python backend
          try {
            // FIX: Use the full Vercel deployment URL
            // NOTE: You must replace 'YOUR_VERCEL_DEPLOYMENT_URL' with your actual URL.
            const vercelUrl = "https://forecast-disease.vercel.app/";
            const apiUrl = `${vercelUrl}/api/hospital_finder?lat=${lat}&lng=${lng}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to fetch hospitals from the server.");
            }

            const data = await response.json();
            setHospitals(data); // Set the hospitals list from the API response
            setLoading(false); // End loading state
          } catch (e) {
            setError(e.message);
            setLoading(false);
          }
        },
        (err) => {
          // Handle specific Geolocation errors
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError("Location access was denied. Please enable it in your browser settings.");
              break;
            case err.POSITION_UNAVAILABLE:
              setError("Location information is currently unavailable.");
              break;
            case err.TIMEOUT:
              setError("The request to get your location timed out.");
              break;
            default:
              setError("An unknown location error occurred.");
          }
          setLoading(false);
        },
        { timeout: 10000 } // 10-second timeout for geolocation
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">Nearby Hospital Locator</h1>
        
        {/* Status and Error Messages */}
        {loading && (
          <p className="text-blue-400 text-center mb-4">Finding nearby hospitals...</p>
        )}
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}

        {/* The main button to find hospitals */}
        <button
          onClick={findHospitals}
          disabled={loading}
          className={`w-full font-semibold py-3 px-4 rounded-xl shadow-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-gray-800'
          }`}
        >
          {loading ? 'Searching...' : 'Find Nearby Hospitals'}
        </button>

        {/* Display the list of hospitals */}
        {hospitals.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Results</h2>
            <ul className="space-y-4">
              {hospitals.map((hospital, index) => (
                <li key={index} className="bg-gray-700 p-4 rounded-xl shadow-md">
                  <p className="font-medium text-lg text-gray-200">{hospital.name}</p>
                  <p className="text-sm text-gray-400">{hospital.address}</p>
                  <p className="text-sm text-gray-400">Rating: {hospital.rating}</p>
                  <p className={`text-sm ${hospital.is_open === 'Open' ? 'text-green-400' : 'text-red-400'}`}>
                    Status: {hospital.is_open}
                  </p>
                  <a
                    href={hospital.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm mt-2 block"
                  >
                    View on Google Maps
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalLocator;
