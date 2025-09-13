// src/app/community/page.tsx
'use client'; 

// --- FIX: Added the missing 'import React' line ---
import React, { useState, useMemo } from 'react';

// Moved hospital data outside the component to prevent re-creation on every render
const hospitalData = [
  // ... (keep all your 75 hospital objects here)
  { district: "agra", name: "Synergy Plus Hospital", type: "private", specialty: "Cardiology, Multi-speciality", contact: "0562-1234567", distance: "3.2 km" },
  { district: "aligarh", name: "Rameshwaram Hospital", type: "private", specialty: "Multi-speciality, Trauma", contact: "0571-2345678", distance: "2.1 km" },
  { district: "lucknow", name: "Medanta Hospital", type: "private", specialty: "Super-speciality, Organ Transplant", contact: "0522-6719999", distance: "4.2 km" },
  { district: "varanasi", name: "Apex Hospital", type: "private", specialty: "Super-speciality, Neurology", contact: "0542-6666666", distance: "3.7 km" },
  // ... etc.
];

const districts = [
    "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
];

const CommunityPage = () => {
  // State for managing the filters
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');

  // Filter the facilities based on the current state
  const filteredFacilities = useMemo(() => {
    return hospitalData.filter(facility => {
      const typeMatch = selectedType === 'all' || facility.type === selectedType;
      const districtMatch = selectedDistrict === 'all' || facility.district.toLowerCase() === selectedDistrict.toLowerCase().replace(/ /g, '-');
      return typeMatch && districtMatch;
    });
  }, [selectedType, selectedDistrict]);

  const capitalizeFirstLetter = (string) => {
    return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Uttar Pradesh Healthcare Directory</h1>
        <p className={styles.tagline}>
          Find government, private, and NGO healthcare facilities across all 75 districts of Uttar Pradesh
        </p>
      </header>

      <div className={styles.filtersContainer}>
        <div className={styles.filters}>
          <button
            className={`${styles.filterBtn} ${selectedType === 'all' ? styles.active : ''}`}
            onClick={() => setSelectedType('all')}
          >
            All Facilities
          </button>
          <button
            className={`${styles.filterBtn} ${selectedType === 'government' ? styles.active : ''}`}
            onClick={() => setSelectedType('government')}
          >
            Government
          </button>
          <button
            className={`${styles.filterBtn} ${selectedType === 'private' ? styles.active : ''}`}
            onClick={() => setSelectedType('private')}
          >
            Private
          </button>
          <button
            className={`${styles.filterBtn} ${selectedType === 'ngo' ? styles.active : ''}`}
            onClick={() => setSelectedType('ngo')}
          >
            NGO
          </button>
        </div>

        <div className={styles.districtFilter}>
          <select
            className={styles.districtDropdown}
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="all">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district.toLowerCase().replace(/ /g, '-')}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.facilitiesList}>
        {filteredFacilities.length > 0 ? (
          filteredFacilities.map((facility, index) => {
            const typeClass = facility.type; // 'government', 'private', or 'ngo'
            const typeLabel = facility.type.charAt(0).toUpperCase() + facility.type.slice(1);
            
            return (
              <div key={index} className={styles.facilityCard}>
                <div className={styles.facilityName}>
                  <span>{facility.name}</span>
                  <span className={`${styles.facilityType} ${styles[typeClass]}`}>{typeLabel}</span>
                </div>
                <div className={styles.facilityDetails}>
                  <div className={styles.detailItem}>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{capitalizeFirstLetter(facility.district)} • {facility.distance} away</span>
                  </div>
                  <div className={styles.detailItem}>
                    <i className="fas fa-stethoscope"></i>
                    <span>{facility.specialty}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <i className="fas fa-phone"></i>
                    <span>{facility.contact}</span>
                  </div>
                </div>
                <a href="#" className={styles.actionBtn}>Get Directions</a>
              </div>
            );
          })
        ) : (
          <div className={styles.noResults}>
            <i className="fas fa-hospital-user"></i>
            <h3>No facilities found</h3>
            <p>Try selecting a different filter combination</p>
          </div>
        )}
      </div>
      
      <footer className={styles.footer}>
        <p>Uttar Pradesh Healthcare Directory &copy; 2025 | Connecting you to healthcare facilities across all 75 districts</p>
        <p>For emergencies, dial 108 for ambulance services | Health Helpline: 104</p>
      </footer>
    </div>
  );
};

export default CommunityPage;
