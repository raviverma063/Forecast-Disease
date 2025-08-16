"use client";

import { useEffect, useState } from "react";

interface Hospital {
  name: string;
  lat: number;
  lng: number;
  distance: number;
  type: string;
  score: number;
}

const FILTERS = ["All", "Government", "Private", "NGO"];

export default function HospitalFinder() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [filteredHospitals, setFilteredHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.onload = () => initMap();
    document.body.appendChild(script);
  }, []);

  function initMap() {
    const userLocation = { lat: 27.1333, lng: 81.9333 }; // Example: Gonda

    const map = new google.maps.Map(document.createElement("div"), {
      center: userLocation,
      zoom: 14,
    });

    const service = new google.maps.places.PlacesService(map);

    const request = {
      location: userLocation,
      radius: 5000,
      type: ["hospital"],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const list: Hospital[] = results.map((place: any) => {
          const distance = calcDistance(
            userLocation.lat,
            userLocation.lng,
            place.geometry.location.lat(),
            place.geometry.location.lng()
          );
          return {
            name: place.name,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            distance,
            type: guessType(place.name),
            score: customScore(place, distance),
          };
        });

        const sorted = list.sort((a, b) => b.score - a.score);
        setHospitals(sorted);
        setFilteredHospitals(sorted);
        setLoading(false);
      }
    });
  }

  function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function guessType(name: string) {
    if (name.toLowerCase().includes("government")) return "Government";
    if (name.toLowerCase().includes("ngo")) return "NGO";
    return "Private";
  }

  function customScore(place: any, distance: number) {
    let score = 50;
    if (place.rating) score += place.rating * 5;
    if (distance < 3) score += 20;
    if (distance > 8) score -= 10;
    return score;
  }

  function applyFilter(filter: string) {
    setActiveFilter(filter);
    if (filter === "All") {
      setFilteredHospitals(hospitals);
    } else {
      setFilteredHospitals(hospitals.filter((h) => h.type === filter));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">
        Community Health Hub
      </h1>

      {/* Filter Buttons */}
      <div className="flex space-x-3 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => applyFilter(f)}
            className={`px-4 py-2 rounded-xl ${
              activeFilter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-400">Loading hospitals...</p>}

      <div className="grid md:grid-cols-3 gap-4">
        {filteredHospitals.map((h, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl p-4 shadow-lg border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-white">{h.name}</h2>
            <p className="text-gray-400">{h.type}</p>
            <p className="text-gray-300">📍 {h.distance.toFixed(1)} km away</p>
            <p className="text-green-400">⭐ Score: {h.score}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 mt-3 rounded-xl text-center"
            >
              Get Directions
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
