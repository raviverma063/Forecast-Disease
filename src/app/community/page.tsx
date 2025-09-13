<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UP Healthcare Directory</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background-color: #f8fafc;
            color: #334155;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            text-align: center;
            margin-bottom: 30px;
            padding: 30px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
        }
        
        h1 {
            font-size: 2.8rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        
        .tagline {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .filters-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .filters {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .filter-btn {
            padding: 12px 25px;
            border: none;
            border-radius: 50px;
            background-color: #eef2ff;
            color: #3b82f6;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
        }
        
        .filter-btn.active {
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
        }
        
        .filter-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .district-filter {
            position: relative;
            min-width: 250px;
        }
        
        .district-dropdown {
            width: 100%;
            padding: 12px 45px 12px 20px;
            border: none;
            border-radius: 50px;
            background-color: #eef2ff;
            color: #3b82f6;
            font-weight: 600;
            cursor: pointer;
            appearance: none;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
        }
        
        .district-dropdown:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        
        .district-filter::after {
            content: "\f078";
            font-family: "Font Awesome 6 Free";
            font-weight: 900;
            position: absolute;
            top: 50%;
            right: 20px;
            transform: translateY(-50%);
            color: #3b82f6;
            pointer-events: none;
        }
        
        .facilities-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 25px;
        }
        
        .facility-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        
        .facility-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }
        
        .facility-name {
            font-size: 1.5rem;
            color: #1e293b;
            margin-bottom: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .facility-type {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
        }
        
        .government {
            background-color: #dbeafe;
            color: #1d4ed8;
        }
        
        .private {
            background-color: #fef3c7;
            color: #d97706;
        }
        
        .ngo {
            background-color: #dcfce7;
            color: #15803d;
        }
        
        .facility-details {
            margin: 15px 0;
            color: #475569;
            flex-grow: 1;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .detail-item i {
            width: 24px;
            color: #3b82f6;
            margin-right: 12px;
        }
        
        .action-btn {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #3b82f6, #1e40af);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            text-align: center;
            margin-top: 15px;
        }
        
        .action-btn:hover {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        
        .no-results i {
            font-size: 3rem;
            color: #cbd5e1;
            margin-bottom: 20px;
        }
        
        footer {
            text-align: center;
            margin-top: 50px;
            padding: 30px;
            color: #64748b;
            font-size: 0.95rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
        }
        
        @media (max-width: 900px) {
            .filters-container {
                flex-direction: column;
                align-items: stretch;
            }
            
            .filters {
                justify-content: center;
            }
            
            .district-filter {
                width: 100%;
            }
        }
        
        @media (max-width: 600px) {
            .filters {
                gap: 10px;
            }
            
            .filter-btn {
                padding: 10px 20px;
                font-size: 0.9rem;
            }
            
            .facilities-list {
                grid-template-columns: 1fr;
            }
            
            .facility-name {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .facility-type {
                margin-top: 10px;
            }
            
            h1 {
                font-size: 2.2rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Uttar Pradesh Healthcare Directory</h1>
            <p class="tagline">Find government, private, and NGO healthcare facilities across all 75 districts of Uttar Pradesh</p>
        </header>
        
        <div class="filters-container">
            <div class="filters">
                <button class="filter-btn active" data-filter="all">All Facilities</button>
                <button class="filter-btn" data-filter="government">Government</button>
                <button class="filter-btn" data-filter="private">Private</button>
                <button class="filter-btn" data-filter="ngo">NGO</button>
            </div>
            
            <div class="district-filter">
                <select class="district-dropdown" id="district-select">
                    <option value="all">All Districts</option>
                    <option value="agra">Agra</option>
                    <option value="aligarh">Aligarh</option>
                    <option value="ambedkar-nagar">Ambedkar Nagar</option>
                    <option value="amethi">Amethi</option>
                    <option value="amroha">Amroha</option>
                    <option value="auraiya">Auraiya</option>
                    <option value="ayodhya">Ayodhya</option>
                    <option value="azamgarh">Azamgarh</option>
                    <option value="baghpat">Baghpat</option>
                    <option value="bahraich">Bahraich</option>
                    <option value="ballia">Ballia</option>
                    <option value="balrampur">Balrampur</option>
                    <option value="banda">Banda</option>
                    <option value="barabanki">Barabanki</option>
                    <option value="bareilly">Bareilly</option>
                    <option value="basti">Basti</option>
                    <option value="bhadohi">Bhadohi</option>
                    <option value="bijnor">Bijnor</option>
                    <option value="budaun">Budaun</option>
                    <option value="bulandshahr">Bulandshahr</option>
                    <option value="chandauli">Chandauli</option>
                    <option value="chitrakoot">Chitrakoot</option>
                    <option value="deoria">Deoria</option>
                    <option value="etah">Etah</option>
                    <option value="etawah">Etawah</option>
                    <option value="farrukhabad">Farrukhabad</option>
                    <option value="fatehpur">Fatehpur</option>
                    <option value="firozabad">Firozabad</option>
                    <option value="gautam-buddha-nagar">Gautam Buddha Nagar</option>
                    <option value="ghaziabad">Ghaziabad</option>
                    <option value="ghazipur">Ghazipur</option>
                    <option value="gonda">Gonda</option>
                    <option value="gorakhpur">Gorakhpur</option>
                    <option value="hamirpur">Hamirpur</option>
                    <option value="hapur">Hapur</option>
                    <option value="hardoi">Hardoi</option>
                    <option value="hathras">Hathras</option>
                    <option value="jalaun">Jalaun</option>
                    <option value="jaunpur">Jaunpur</option>
                    <option value="jhansi">Jhansi</option>
                    <option value="kannauj">Kannauj</option>
                    <option value="kanpur-dehat">Kanpur Dehat</option>
                    <option value="kanpur-nagar">Kanpur Nagar</option>
                    <option value="kasganj">Kasganj</option>
                    <option value="kaushambi">Kaushambi</option>
                    <option value="kushinagar">Kushinagar</option>
                    <option value="lakhimpur-kheri">Lakhimpur Kheri</option>
                    <option value="lalitpur">Lalitpur</option>
                    <option value="lucknow">Lucknow</option>
                    <option value="maharajganj">Maharajganj</option>
                    <option value="mahoba">Mahoba</option>
                    <option value="mainpuri">Mainpuri</option>
                    <option value="mathura">Mathura</option>
                    <option value="mau">Mau</option>
                    <option value="meerut">Meerut</option>
                    <option value="mirzapur">Mirzapur</option>
                    <option value="moradabad">Moradabad</option>
                    <option value="muzaffarnagar">Muzaffarnagar</option>
                    <option value="pilibhit">Pilibhit</option>
                    <option value="pratapgarh">Pratapgarh</option>
                    <option value="prayagraj">Prayagraj</option>
                    <option value="raebareli">Raebareli</option>
                    <option value="rampur">Rampur</option>
                    <option value="saharanpur">Saharanpur</option>
                    <option value="sambhal">Sambhal</option>
                    <option value="sant-kabir-nagar">Sant Kabir Nagar</option>
                    <option value="shahjahanpur">Shahjahanpur</option>
                    <option value="shamli">Shamli</option>
                    <option value="shravasti">Shravasti</option>
                    <option value="siddharthnagar">Siddharthnagar</option>
                    <option value="sitapur">Sitapur</option>
                    <option value="sonbhadra">Sonbhadra</option>
                    <option value="sultanpur">Sultanpur</option>
                    <option value="unnao">Unnao</option>
                    <option value="varanasi">Varanasi</option>
                </select>
            </div>
        </div>
        
        <div class="facilities-list" id="facilities-container">
            <!-- Facilities will be dynamically inserted here -->
        </div>
        
        <footer>
            <p>Uttar Pradesh Healthcare Directory &copy; 2023 | Connecting you to healthcare facilities across all 75 districts</p>
            <p>For emergencies, dial 108 for ambulance services | Health Helpline: 104</p>
        </footer>
    </div>

    <script>
        // Hospital data for all 75 districts
        const hospitalData = [
            { district: "agra", name: "Synergy Plus Hospital", type: "private", specialty: "Cardiology, Multi-speciality", contact: "0562-1234567", distance: "3.2 km" },
            { district: "aligarh", name: "Rameshwaram Hospital", type: "private", specialty: "Multi-speciality, Trauma", contact: "0571-2345678", distance: "2.1 km" },
            { district: "ambedkar-nagar", name: "District Combined Hospital, Akbarpur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05271-345678", distance: "1.5 km" },
            { district: "amethi", name: "District Hospital, Amethi", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05372-456789", distance: "0.8 km" },
            { district: "amroha", name: "VPL Hospital", type: "private", specialty: "Multi-speciality", contact: "05922-567890", distance: "2.7 km" },
            { district: "auraiya", name: "100 Bedded Combined Hospital, Auraiya", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05683-678901", distance: "1.2 km" },
            { district: "ayodhya", name: "District Hospital, Ayodhya", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05278-789012", distance: "1.0 km" },
            { district: "azamgarh", name: "Vedanta Hospital", type: "private", specialty: "Multi-speciality", contact: "05462-890123", distance: "2.5 km" },
            { district: "baghpat", name: "District Hospital, Baghpat", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "01234-901234", distance: "0.9 km" },
            { district: "bahraich", name: "Maharishi Balark District Hospital", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05252-012345", distance: "1.3 km" },
            { district: "ballia", name: "Jeevan Jyoti Hospital", type: "private", specialty: "Orthopaedics, General Surgery", contact: "05498-123450", distance: "2.8 km" },
            { district: "balrampur", name: "District Hospital, Balrampur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05263-234561", distance: "0.7 km" },
            { district: "banda", name: "Government Medical College, Banda", type: "government", specialty: "Multi-speciality, Medical College", contact: "05192-345672", distance: "2.0 km" },
            { district: "barabanki", name: "Mayo Hospital", type: "private", specialty: "Multi-speciality", contact: "05248-456783", distance: "3.1 km" },
            { district: "bareilly", name: "Mission Hospital", type: "private", specialty: "Multi-speciality, Critical Care", contact: "0581-567894", distance: "2.4 km" },
            { district: "basti", name: "OPEK Hospital, Basti", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05542-678905", distance: "1.1 km" },
            { district: "bhadohi", name: "Maharaja Balwant Singh Govt. Hospital", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05414-789016", distance: "0.6 km" },
            { district: "bijnor", name: "Bijnor Multi-speciality Hospital", type: "private", specialty: "Multi-speciality", contact: "01342-890127", distance: "2.9 km" },
            { district: "budaun", name: "Government Medical College, Budaun", type: "government", specialty: "Multi-speciality, Medical College", contact: "05832-901238", distance: "1.8 km" },
            { district: "bulandshahr", name: "Kailash Hospital", type: "private", specialty: "Multi-speciality", contact: "05732-012349", distance: "3.3 km" },
            { district: "chandauli", name: "District Hospital, Chandauli", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05412-123460", distance: "0.5 km" },
            { district: "chitrakoot", name: "District Hospital, Chitrakoot", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05198-234571", distance: "1.4 km" },
            { district: "deoria", name: "Maharshi Devraha Baba Medical College", type: "government", specialty: "Multi-speciality, Medical College", contact: "05568-345682", distance: "2.2 km" },
            { district: "etah", name: "District Hospital, Etah", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05742-456793", distance: "0.8 km" },
            { district: "etawah", name: "Prasad Hospital", type: "private", specialty: "Multi-speciality", contact: "05688-567804", distance: "2.6 km" },
            { district: "farrukhabad", name: "Dr. Ram Manohar Lohia District Hospital", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05692-678915", distance: "1.2 km" },
            { district: "fatehpur", name: "District Hospital, Fatehpur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05180-789026", distance: "0.9 km" },
            { district: "firozabad", name: "Nidan Hospital", type: "private", specialty: "Multi-speciality", contact: "05612-890137", distance: "3.0 km" },
            { district: "gautam-buddha-nagar", name: "Fortis Hospital, Noida", type: "private", specialty: "Super-speciality, Cardiac Sciences", contact: "0120-7125100", distance: "4.5 km" },
            { district: "ghaziabad", name: "Yashoda Super Speciality Hospital", type: "private", specialty: "Super-speciality, Critical Care", contact: "0120-2322222", distance: "3.8 km" },
            { district: "ghazipur", name: "District Hospital, Ghazipur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "0548-234568", distance: "1.1 km" },
            { district: "gonda", name: "SCPM Hospital", type: "private", specialty: "Multi-speciality", contact: "05262-345679", distance: "2.7 km" },
            { district: "gorakhpur", name: "Savvy Hospital & Research Centre", type: "private", specialty: "Multi-speciality, Cardiology", contact: "0551-456780", distance: "2.3 km" },
            { district: "hamirpur", name: "District Hospital, Hamirpur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05282-567891", distance: "0.7 km" },
            { district: "hapur", name: "GS Medical College and Hospital", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "0122-678902", distance: "1.5 km" },
            { district: "hardoi", name: "District Hospital, Hardoi", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05852-789013", distance: "0.8 km" },
            { district: "hathras", name: "District Hospital, Hathras", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05722-890124", distance: "1.0 km" },
            { district: "jalaun", name: "Government Medical College, Jalaun", type: "government", specialty: "Multi-speciality, Medical College", contact: "05162-901235", distance: "1.9 km" },
            { district: "jaunpur", name: "Prasad Hospital", type: "private", specialty: "Multi-speciality", contact: "05452-012346", distance: "2.8 km" },
            { district: "jhansi", name: "Ramraja Hospital and Trauma Centre", type: "private", specialty: "Trauma, Multi-speciality", contact: "0510-123457", distance: "3.1 km" },
            { district: "kannauj", name: "Government Medical College, Kannauj", type: "government", specialty: "Multi-speciality, Medical College", contact: "05694-234568", distance: "1.7 km" },
            { district: "kanpur-dehat", name: "District Hospital, Kanpur Dehat", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05112-345679", distance: "0.9 km" },
            { district: "kanpur-nagar", name: "Regency Hospital", type: "private", specialty: "Super-speciality, Renal Sciences", contact: "0512-4009000", distance: "3.5 km" },
            { district: "kasganj", name: "District Hospital, Kasganj", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05744-456790", distance: "0.6 km" },
            { district: "kaushambi", name: "District Hospital, Kaushambi", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05178-567801", distance: "1.2 km" },
            { district: "kushinagar", name: "District Hospital, Kushinagar", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05566-678912", distance: "0.8 km" },
            { district: "lakhimpur-kheri", name: "District Hospital, Lakhimpur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05872-789023", distance: "1.1 km" },
            { district: "lalitpur", name: "District Hospital, Lalitpur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05176-890134", distance: "0.7 km" },
            { district: "lucknow", name: "Medanta Hospital", type: "private", specialty: "Super-speciality, Organ Transplant", contact: "0522-6719999", distance: "4.2 km" },
            { district: "maharajganj", name: "District Hospital, Maharajganj", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05523-901245", distance: "0.9 km" },
            { district: "mahoba", name: "District Hospital, Mahoba", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05281-012356", distance: "1.0 km" },
            { district: "mainpuri", name: "District Hospital, Mainpuri", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05672-123467", distance: "0.8 km" },
            { district: "mathura", name: "Nayati Medicity", type: "private", specialty: "Super-speciality, Oncology", contact: "0565-1234567", distance: "3.9 km" },
            { district: "mau", name: "Life Line Hospital & Research Center", type: "private", specialty: "Multi-speciality", contact: "0547-2345678", distance: "2.6 km" },
            { district: "meerut", name: "Anand Hospital", type: "private", specialty: "Super-speciality, Critical Care", contact: "0121-3456789", distance: "3.4 km" },
            { district: "mirzapur", name: "District Hospital, Mirzapur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05442-456789", distance: "1.2 km" },
            { district: "moradabad", name: "Cosmos Hospital", type: "private", specialty: "Multi-speciality, Cardiac Care", contact: "0591-5678901", distance: "2.9 km" },
            { district: "muzaffarnagar", name: "Vardhman Hospital", type: "private", specialty: "Multi-speciality, Orthopaedics", contact: "0131-6789012", distance: "3.1 km" },
            { district: "pilibhit", name: "District Hospital, Pilibhit", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05882-789012", distance: "0.7 km" },
            { district: "pratapgarh", name: "District Hospital, Pratapgarh", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05342-890123", distance: "1.0 km" },
            { district: "prayagraj", name: "Nazareth Hospital", type: "private", specialty: "Multi-speciality, Critical Care", contact: "0532-9012345", distance: "3.2 km" },
            { district: "raebareli", name: "District Hospital, Raebareli", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "0535-0123456", distance: "0.9 km" },
            { district: "rampur", name: "District Hospital, Rampur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "0595-1234567", distance: "1.1 km" },
            { district: "saharanpur", name: "Star Hospital", type: "private", specialty: "Multi-speciality", contact: "0132-2345678", distance: "2.8 km" },
            { district: "sambhal", name: "District Hospital, Sambhal", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05924-345678", distance: "0.8 km" },
            { district: "sant-kabir-nagar", name: "District Hospital, Sant Kabir Nagar", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05547-456789", distance: "1.0 km" },
            { district: "shahjahanpur", name: "Government Medical College", type: "government", specialty: "Multi-speciality, Medical College", contact: "05842-567890", distance: "1.6 km" },
            { district: "shamli", name: "District Combined Hospital, Shamli", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "01398-678901", distance: "0.9 km" },
            { district: "shravasti", name: "District Hospital, Shravasti", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05250-789012", distance: "0.7 km" },
            { district: "siddharthnagar", name: "Madhav Prasad Tripathi Medical College", type: "government", specialty: "Multi-speciality, Medical College", contact: "05542-890123", distance: "1.8 km" },
            { district: "sitapur", name: "District Hospital, Sitapur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05862-901234", distance: "1.0 km" },
            { district: "sonbhadra", name: "District Hospital, Sonbhadra", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05444-012345", distance: "1.2 km" },
            { district: "sultanpur", name: "District Hospital, Sultanpur", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "05362-123456", distance: "0.8 km" },
            { district: "unnao", name: "District Hospital, Unnao", type: "government", specialty: "Multi-speciality & Emergency Care", contact: "0515-234567", distance: "1.1 km" },
            { district: "varanasi", name: "Apex Hospital", type: "private", specialty: "Super-speciality, Neurology", contact: "0542-6666666", distance: "3.7 km" }
        ];

        document.addEventListener('DOMContentLoaded', function() {
            const filterButtons = document.querySelectorAll('.filter-btn');
            const districtSelect = document.getElementById('district-select');
            const facilitiesContainer = document.getElementById('facilities-container');
            
            // Render all facilities initially
            renderFacilities(hospitalData);
            
            // Filter by type
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    
                    // Add active class to clicked button
                    button.classList.add('active');
                    
                    applyFilters();
                });
            });
            
            // Filter by district
            districtSelect.addEventListener('change', applyFilters);
            
            function applyFilters() {
                const typeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                const districtFilter = districtSelect.value;
                
                // Filter facilities based on selection
                const filteredFacilities = hospitalData.filter(facility => {
                    const typeMatch = typeFilter === 'all' || facility.type === typeFilter;
                    const districtMatch = districtFilter === 'all' || facility.district === districtFilter;
                    
                    return typeMatch && districtMatch;
                });
                
                renderFacilities(filteredFacilities);
            }
            
            function renderFacilities(facilities) {
                facilitiesContainer.innerHTML = '';
                
                if (facilities.length === 0) {
                    facilitiesContainer.innerHTML = `
                        <div class="no-results">
                            <i class="fas fa-hospital"></i>
                            <h3>No facilities found</h3>
                            <p>Try selecting a different filter combination</p>
                        </div>
                    `;
                    return;
                }
                
                facilities.forEach(facility => {
                    const facilityCard = document.createElement('div');
                    facilityCard.className = 'facility-card';
                    facilityCard.setAttribute('data-type', facility.type);
                    facilityCard.setAttribute('data-district', facility.district);
                    
                    const typeClass = facility.type === 'government' ? 'government' : 
                                    facility.type === 'private' ? 'private' : 'ngo';
                    
                    const typeLabel = facility.type === 'government' ? 'Government' : 
                                    facility.type === 'private' ? 'Private' : 'NGO';
                    
                    facilityCard.innerHTML = `
                        <div class="facility-name">
                            <span>${facility.name}</span>
                            <span class="facility-type ${typeClass}">${typeLabel}</span>
                        </div>
                        <div class="facility-details">
                            <div class="detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${capitalizeFirstLetter(facility.district)} • ${facility.distance} away</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-stethoscope"></i>
                                <span>${facility.specialty}</span>
                            </div>
                            <div class="detail-item">
                                <i class="fas fa-phone"></i>
                                <span>${facility.contact}</span>
                            </div>
                        </div>
                        <a href="#" class="action-btn">Get Directions</a>
                    `;
                    
                    facilitiesContainer.appendChild(facilityCard);
                });
            }
            
            function capitalizeFirstLetter(string) {
                return string.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
                    .replace(/-/g, ' ');
            }
        });
    </script>
</body>
</html>
