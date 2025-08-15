/from flask import Flask, request, jsonify

app = Flask(__name__)

# --- DATA SOURCES (Simulated for Demonstration) ---
up_outbreak_data = {
    "Kanpur_208001": {
        "Dengue": {"cases_this_week": 17, "cases_last_week": 12, "breeding_sites_reported_km": 0.5},
        "Influenza": {"opd_cases_percentage_increase": 27},
        "Gastroenteritis": {"waterborne_reports_nearby_wards": True}
    },
    "Kanpur_208012": {
        "Dengue": {"cases_this_week": 5, "cases_last_week": 4, "breeding_sites_reported_km": 2.1},
        "Influenza": {"opd_cases_percentage_increase": 15},
        "Gastroenteritis": {"waterborne_reports_nearby_wards": False}
    }
}
weather_data = {
    "Kanpur": {"season": "Monsoon", "humidity_percent": 85, "recent_rainfall_mm": 40}
}

def generate_live_disease_radar(user_profile):
    pincode = user_profile.get("pincode", "Kanpur_208001") # Use a default if not provided
    alerts = []
    local_outbreaks = up_outbreak_data.get(pincode, {})
    local_weather = weather_data.get("Kanpur", {})

    # --- THREAT ASSESSMENT LOGIC ---
    # (Your original prediction logic goes here)
    # 1. Dengue Fever Assessment
    if "Dengue" in local_outbreaks and local_weather.get("season") == "Monsoon":
        dengue_data = local_outbreaks["Dengue"]
        if dengue_data.get("cases_last_week", 0) > 0:
            growth_rate = round(((dengue_data["cases_this_week"] - dengue_data["cases_last_week"]) / dengue_data["cases_last_week"]) * 100)
            if growth_rate > 40:
                alerts.append({
                    "threat_level": "🚨 Immediate Threat", "disease": "Dengue Fever Spike",
                    "why_urgent": f"Dengue cases in your locality ↑ {growth_rate}% this week, mosquito breeding reported within {dengue_data['breeding_sites_reported_km']} km radius."
                })
    # Add other disease assessments here...
    return alerts

@app.route('/api/predictor', methods=['POST'])
def predictor_api():
    # Get the user profile sent from the website
    user_profile = request.json
    # Run your prediction logic
    alerts = generate_live_disease_radar(user_profile)
    # Send the results back to the website
    return jsonify(alerts)
