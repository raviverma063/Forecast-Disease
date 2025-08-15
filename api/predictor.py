from flask import Flask, request, jsonify

app = Flask(__name__)

# --- This function now generates the full, detailed alert structure ---
def generate_live_disease_radar(user_profile):
    """
    Generates a list of personalized, disease-focused alerts.
    The data is hardcoded for demonstration but structured like a real API response.
    """
    # In a real system, you would use the user_profile to customize this more.
    # For now, we will return a generic, full set of alerts for any user.
    
    alerts = [
        {
            "level": "Immediate",
            "title": "Dengue Fever Spike",
            "whyLabel": "Why Urgent",
            "whyText": f"Dengue cases in your locality are rising with the season. Mosquito breeding is common in this weather.",
            "actionLabel": "Action — Do This Today",
            "actions": [
                {"emoji": "🦟", "text": "Apply mosquito repellent (DEET 20%) morning + evening."},
                {"emoji": "👖", "text": "Wear full sleeves + trousers during 6–9 PM peak mosquito activity."},
                {"emoji": "🚫", "text": "Remove all standing water at home now."},
                {"emoji": "🧾", "text": "Monitor for fever + headache + rash → test within 24 hrs."}
            ]
        },
        {
            "level": "High",
            "title": "Seasonal Influenza Surge",
            "whyLabel": "Why Important",
            "whyText": "Rain + humidity is increasing flu virus spread across the region.",
            "actionLabel": "Action This Week",
            "actions": [
                {"emoji": "😷", "text": "Wear mask in crowded indoor areas."},
                {"emoji": "🧴", "text": "Wash hands frequently with soap/sanitizer."},
                {"emoji": "💉", "text": "If not vaccinated in last 12 months → get flu shot within 3 days."}
            ]
        },
        {
            "level": "Moderate",
            "title": "Acute Gastroenteritis",
            "whyLabel": "Why Notable",
            "whyText": "Risk of waterborne diarrhea increases during this season.",
            "actionLabel": "Action in Next 48 hrs",
            "actions": [
                {"emoji": "💧", "text": "Drink only boiled/RO water."},
                {"emoji": "🥗", "text": "Avoid street food, especially during rains."},
                {"emoji": "🧪", "text": "If diarrhea + fever → stool test & oral rehydration immediately."}
            ]
        }
    ]
    
    return alerts

@app.route('/api/predictor', methods=['POST'])
def predictor_api():
    user_profile = request.json
    alerts = generate_live_disease_radar(user_profile)
    return jsonify(alerts)

