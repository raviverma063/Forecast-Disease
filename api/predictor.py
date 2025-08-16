from flask import Flask, request, jsonify
import datetime

app = Flask(__name__)

# --- MEDICAL KNOWLEDGE BASE ---
# This section simulates a database of detailed medical information.
disease_protocols = {
    "Dengue Fever Spike": {
        "physiology": "Dengue is a viral infection transmitted by the Aedes mosquito. The virus replicates in the bloodstream, leading to symptoms like high fever, severe headache, muscle/joint pains, and a characteristic skin rash. In severe cases, it can cause plasma leakage, leading to shock.",
        "pathology": "The primary pathology involves thrombocytopenia (low platelet count) and hemoconcentration (increased blood thickness), which can lead to Dengue Hemorrhagic Fever (DHF) or Dengue Shock Syndrome (DSS) if not managed.",
        "management_protocol_goi": "As per the National Vector Borne Disease Control Programme (NVBDCP), management is primarily supportive. Key protocols include: 1) Adequate hydration (oral rehydration salts/IV fluids). 2) Paracetamol for fever (Aspirin/NSAIDs are contraindicated). 3) Close monitoring of platelet count and hematocrit. 4) Hospitalization for any warning signs (e.g., persistent vomiting, severe abdominal pain, bleeding).",
        "preventive_measures": "Focus on mosquito control: eliminate standing water, use mosquito nets and repellents (DEET), and wear protective clothing."
    },
    "Seasonal Influenza Surge": {
        "physiology": "Influenza is a respiratory virus that infects the nose, throat, and lungs. It causes inflammation of the upper respiratory tract, leading to fever, cough, sore throat, body aches, and fatigue.",
        "pathology": "The virus damages respiratory epithelial cells. In severe cases, it can lead to viral pneumonia or secondary bacterial pneumonia. High-risk groups (elderly, young children, those with chronic conditions) are more susceptible to complications.",
        "management_protocol_goi": "The Ministry of Health and Family Welfare guidelines recommend: 1) Symptomatic treatment with antipyretics. 2) Antiviral drugs like Oseltamivir for severe cases or high-risk patients. 3) Emphasis on annual flu vaccination for prevention. 4) Home isolation to prevent spread.",
        "preventive_measures": "Annual vaccination is the most effective prevention. Practice good hand hygiene and wear masks in crowded areas during peak season."
    },
    "Acute Gastroenteritis": {
        "physiology": "Caused by viruses (like Rotavirus) or bacteria, it leads to inflammation of the stomach and intestines. This impairs water and electrolyte absorption, causing diarrhea and vomiting.",
        "pathology": "The main pathological concern is dehydration and electrolyte imbalance, which can be life-threatening, especially in children and the elderly. The specific pathogen determines the severity and potential for complications.",
        "management_protocol_goi": "The Integrated Disease Surveillance Programme (IDSP) focuses on: 1) Oral Rehydration Therapy (ORT) with Oral Rehydration Solution (ORS) as the cornerstone of treatment. 2) Zinc supplementation for children to reduce the duration and severity of diarrhea. 3) Promoting handwashing and safe drinking water to prevent outbreaks.",
        "preventive_measures": "Drink boiled or purified water, wash hands thoroughly before eating, and avoid consuming street food, especially during monsoon season."
    }
}

def get_personalized_risk_analysis(profile, query):
    """
    Analyzes a user's query to provide detailed information about a specific disease.
    """
    lower_query = query.lower()
    
    disease_name = "Dengue Fever Spike" # Default disease

    if 'flu' in lower_query or 'influenza' in lower_query:
        disease_name = "Seasonal Influenza Surge"
    elif 'gastro' in lower_query or 'diarrhea' in lower_query or 'stomach' in lower_query:
        disease_name = "Acute Gastroenteritis"

    # Get the detailed information for the identified disease
    analysis = disease_protocols.get(disease_name, {})
    analysis["diseaseName"] = disease_name
    
    return analysis


@app.route('/api/predictor', methods=['POST'])
def predictor_api():
    data = request.json
    profile_data = data.get('profileData', {})
    query = data.get('query', '')
    analysis = get_personalized_risk_analysis(profile_data, query)
    return jsonify(analysis)
