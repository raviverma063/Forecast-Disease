import React, { useState } from "react";

export default function HospitalLocator() {
  const [error, setError] = useState("");

  const findHospitals = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;

          // Open Google Maps and show nearby hospitals
          window.open(
            `https://www.google.com/maps/search/hospitals/@${lat},${lng},14z`,
            "_blank"
          );
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
    <div className="bg-[#0a0f1c] p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-bold text-blue-400 flex items-center justify-center gap-2">
        🏥 Nearby Hospital Locator
      </h2>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        onClick={findHospitals}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Find Nearby Hospitals
      </button>
    </div>
  );
}
