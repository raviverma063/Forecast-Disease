'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// --- Data for Dropdowns ---
const districts = [
  "Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha",
  "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur",
  "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor",
  "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah",
  "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad",
  "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur",
  "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi",
  "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi",
  "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba",
  "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad",
  "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur",
  "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli",
  "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur",
  "Unnao", "Varanasi"
];
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const waterSources = ["Borewell", "Tap Water", "River", "Well", "Municipal Supply"];
const housingTypes = ["Pucca", "Kutcha", "Semi-Pucca", "Apartment"];
const occupations = [
    "Accountant", "Actor", "Architect", "Artist", "Artisan (Brassware, Pottery, etc.)",
    "Astrologer", "Author", "Baker", "Banker", "Barber", "Beautician",
    "Blacksmith", "Bricklayer", "Bus Driver", "Business Owner", "Butcher",
    "Carpenter", "Cashier", "Chef/Cook", "Chemist", "Civil Engineer", "Cleaner",
    "Clerk", "Construction Worker", "Consultant", "Customer Service Representative",
    "Dancer", "Data Entry Operator", "Dentist", "Designer (Fashion, Graphic, etc.)",
    "Doctor", "Domestic Helper", "Driver (Car, Taxi, Truck)", "Electrician",
    "Engineer (Mechanical, Software, etc.)", "Factory Worker", "Farmer", "Firefighter",
    "Fisherman", "Florist", "Government Employee", "Grocer", "Guard", "Homemaker",
    "Hotel Manager", "IT Professional", "Journalist", "Judge", "Laborer", "Lawyer",
    "Lecturer", "Librarian", "Mechanic", "Military Personnel", "Musician", "Nurse",
    "Painter", "Pharmacist", "Photographer", "Pilot", "Plumber", "Police Officer",
    "Politician", "Priest", "Principal", "Professor", "Real Estate Agent",
    "Receptionist", "Researcher", "Salesperson", "Scientist", "Security Guard",
    "Shopkeeper", "Singer", "Social Worker", "Soldier", "Student", "Tailor",
    "Teacher", "Technician", "Tour Guide", "Translator", "Veterinarian", "Waiter/Waitress",
    "Weaver", "Welder", "Writer", "Yoga Instructor", "Other"
];
const diseases = [
    "None", "Common Cold", "Influenza (Flu)", "Pneumonia", "Bronchitis", "Strep Throat",
    "COVID-19", "Dengue", "Malaria", "Chikungunya", "Typhoid", "Cholera",
    "Hepatitis A/E", "Gastroenteritis (Stomach Flu)", "Food Poisoning",
    "Urinary Tract Infection (UTI)", "Skin Infection (Fungal, Bacterial)",
    "Conjunctivitis (Eye Flu)", "Tuberculosis (TB)", "Measles", "Chickenpox"
];
const chronicConditions = [
    "None", "Hypertension (High BP)", "Diabetes (Type 1/Type 2)", "High Cholesterol",
    "Asthma", "Chronic Obstructive Pulmonary Disease (COPD)", "Arthritis (Rheumatoid/Osteoarthritis)",
    "Chronic Kidney Disease (CKD)", "Heart Disease", "Thyroid Disorder (Hypo/Hyper)",
    "Obesity", "Chronic Migraines", "Depression", "Anxiety Disorder",
    "Polycystic Ovary Syndrome (PCOS)", "Irritable Bowel Syndrome (IBS)", "Chronic Pain"
];
const allergies = [
    "None", "Pollen", "Dust Mites", "Mold", "Animal Dander (Pets)", "Insect Stings",
    "Peanuts", "Tree Nuts", "Milk", "Eggs", "Soy", "Wheat", "Fish", "Shellfish",
    "Penicillin", "Aspirin", "Sulfa Drugs", "Latex", "Fragrances"
];

export default function PrecisionProfileBuilder() {
  const [profile, setProfile] = useState({
    name: '', dob: '', sex: 'Male', bloodGroup: 'A+',
    nativeDistrict: 'Lucknow', currentDistrict: 'Lucknow',
    waterSource: 'Borewell', housingType: 'Pucca',
    primaryOccupation: 'Student', currentDiseases: 'None',
    chronicConditions: 'None', allergies: 'None',
  });
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    alert('Profile Saved!');
  };

  // --- NEW: Function to get location via GPS ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // NOTE: You must have a GOOGLE_MAPS_API_KEY in your Vercel environment variables
        // and the "Geocoding API" must be enabled in your Google Cloud project.
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Assumes key is exposed to client
        if (!apiKey) {
            alert("Google Maps API key is not configured for this site.");
            setLocationLoading(false);
            return;
        }
        
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'OK') {
                // Find the administrative area level 2, which is usually the district in India
                const districtComponent = data.results[0].address_components.find(
                    (comp) => comp.types.includes("administrative_area_level_2")
                );
                if (districtComponent) {
                    const districtName = districtComponent.long_name;
                    // Check if the found district is in our list
                    if (districts.includes(districtName)) {
                        setProfile(prev => ({ ...prev, currentDistrict: districtName }));
                    } else {
                        alert(`Located district "${districtName}", which is not in the list of UP districts.`);
                    }
                } else {
                    alert("Could not determine the district from your location.");
                }
            } else {
                alert("Failed to get location details from Google Maps.");
            }
        } catch (error) {
            console.error("Error fetching location details:", error);
            alert("An error occurred while fetching location details.");
        } finally {
            setLocationLoading(false);
        }
    }, () => {
        alert("Unable to retrieve your location. Please enable location services in your browser.");
        setLocationLoading(false);
    });
  };

  const renderSelect = (name, label, options) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select id={name} name={name} value={profile[name]} onChange={handleChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Precision Profile Builder</h1>
          <p className="text-gray-400 mt-1">Every detail sharpens your protection.</p>
        </header>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">👤 Core Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} placeholder="e.g., Rajesh Kumar" className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-400 mb-1">Date of Birth</label>
                <input type="date" id="dob" name="dob" value={profile.dob} onChange={handleChange} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" />
              </div>
              {renderSelect('sex', 'Sex', ['Male', 'Female', 'Other'])}
              {renderSelect('bloodGroup', 'Blood Group', bloodGroups)}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🌍 District DNA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderSelect('nativeDistrict', 'Native District', districts)}
              <div>
                {renderSelect('currentDistrict', 'Current District', districts)}
                <Button onClick={handleGetLocation} disabled={locationLoading} className="w-full mt-2 text-xs">
                  {locationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Get Current Location via GPS
                </Button>
              </div>
              {renderSelect('waterSource', 'Water Source', waterSources)}
              {renderSelect('housingType', 'Housing Type', housingTypes)}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">💼 Occupational Health</h2>
            {renderSelect('primaryOccupation', 'Primary Occupation', occupations)}
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">❤️ Health Blueprint</h2>
            <div className="space-y-4">
              {renderSelect('currentDiseases', 'Current or Recent Diseases', diseases)}
              {renderSelect('chronicConditions', 'Chronic Conditions', chronicConditions)}
              {renderSelect('allergies', 'Allergies', allergies)}
            </div>
          </div>

          <div className="flex justify-start">
            <Button onClick={handleSaveProfile} className="px-6 py-2 bg-blue-600 hover:bg-blue-700">
              Save Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
