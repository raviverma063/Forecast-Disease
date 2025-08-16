import React, { useState } from "react";

const HospitalLocator = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState("");

  const findHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setError("");
        },
        () => {
          setError("Unable to retrieve your location. Please enable location services.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="text-center mt-6">
      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={findHospitals}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
      >
        📍 Find Nearby Hospitals
      </button>

      {latitude && longitude && (
        <div className="mt-4">
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/search/hospitals/@${latitude},${longitude},14z`,
                "_blank"
              )
            }
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            🏥 Connect to Google Maps
          </button>
        </div>
      )}
    </div>
  );
};

export default HospitalLocator;
