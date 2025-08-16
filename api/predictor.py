from flask import Flask, request, jsonify

app = Flask(__name__)

# --- DATA SOURCES (Simulated for Demonstration) ---
# This data now has specific alerts for different districts
outbreakData = {
  "Default": [
    {
      "level": "Immediate", "title": "Dengue Fever Spike", "whyLabel": "Why Urgent",
      "whyText": "Dengue cases in your locality are rising with the season.",
      "actionLabel": "Action — Do This Today",
      "actions": [{"emoji": "🦟", "text": "Apply mosquito repellent (DEET 20%) morning + evening."}]
    },
    {
      "level": "High", "title": "Seasonal Influenza Surge", "whyLabel": "Why Important",
      "whyText": "Rain + humidity is increasing flu virus spread across the region.",
      "actionLabel": "Action This Week",
      "actions": [{"emoji": "😷", "text": "Wear mask in crowded indoor areas."}]
    },
    {
      "level": "Moderate", "title": "Acute Gastroenteritis", "whyLabel": "Why Notable",
      "whyText": "Risk of waterborne diarrhea increases during this season.",
      "actionLabel": "Action in Next 48 hrs",
      "actions": [{"emoji": "💧", "text": "Drink only boiled/RO water."}]
    }
  ],
  "Kanpur Nagar": [
    {
      "level": "Immediate", "title": "Dengue Fever Spike", "whyLabel": "Why Urgent",
      "whyText": "Dengue cases in Kanpur Nagar ↑ 42% this week.",
      "actionLabel": "Action — Do This Today",
      "actions": [{"emoji": "🦟", "text": "Apply mosquito repellent (DEET 20%) morning + evening."}]
    },
    {
      "level": "High", "title": "Seasonal Influenza Surge", "whyLabel": "Why Important",
      "whyText": "Local OPD cases up 27% in past week in Kanpur.",
      "actionLabel": "Action This Week",
      "actions": [{"emoji": "😷", "text": "Wear mask in crowded indoor areas."}]
    },
    {
      "level": "Moderate", "title": "Acute Gastroenteritis", "whyLabel": "Why Notable",
      "whyText": "Multiple waterborne diarrhea cases reported from nearby wards.",
      "actionLabel": "Action in Next 48 hrs",
      "actions": [{"emoji": "💧", "text": "Drink only boiled/RO water."}]
    }
  ],
  "Lucknow": [
     {
      "level": "Immediate", "title": "Viral Conjunctivitis (Eye Flu) Outbreak", "whyLabel": "Why Urgent",
      "whyText": "A significant surge in Eye Flu cases has been reported across Lucknow.",
      "actionLabel": "Action — Do This Today",
      "actions": [{"emoji": "👁️", "text": "Avoid touching your eyes. Wash hands frequently."}]
    },
    {
      "level": "High", "title": "Typhoid Fever Advisory", "whyLabel": "Why Important",
      "whyText": "Contaminated water sources have led to an increase in Typhoid cases.",
      "actionLabel": "Action This Week",
      "actions": [{"emoji": "💧", "text": "Ensure all drinking water is boiled or from a reliable purifier."}]
    }
  ],
  "Agra": [
    {
      "level": "High", "title": "Heatstroke Advisory", "whyLabel": "Why Important",
      "whyText": "Extreme temperatures above 42°C are forecasted.",
      "actionLabel": "Action This Week",
      "actions": [{"emoji": "💧", "text": "Drink plenty of water, even if not thirsty."}]
    },
    {
      "level": "Moderate", "title": "Foodborne Illness Alert", "whyLabel": "Why Notable",
      "whyText": "An increase in food poisoning cases has been linked to street vendors.",
      "actionLabel": "Action in Next 48 hrs",
      "actions": [{"emoji": "🥗", "text": "Avoid raw or undercooked street food."}]
    }
  ],
  "Varanasi": [
    {
      "level": "High", "title": "Cholera & Waterborne Disease Warning", "whyLabel": "Why Important",
      "whyText": "Recent flooding has increased the risk of water contamination.",
      "actionLabel": "Action This Week",
      "actions": [{"emoji": "💧", "text": "Drink and use only boiled or bottled water."}]
    },
     {
      "level": "Moderate", "title": "Leptospirosis Risk", "whyLabel": "Why Notable",
      "whyText": "Contact with contaminated water or soil can lead to Leptospirosis.",
      "actionLabel": "Action in Next 48 hrs",
      "actions": [{"emoji": "👢", "text": "Wear waterproof boots if you must walk through waterlogged areas."}]
    }
  ]
}

def generate_live_disease_radar(user_profile):
    # Get the district from the user's profile, or use "Default" if it's not there
    district = user_profile.get("currentDistrict", "Default")
    
    # Return the alerts for that specific district
    return outbreakData.get(district, outbreakData["Default"])

@app.route('/api/predictor', methods=['POST'])
def predictor_api():
    user_profile = request.json
    alerts = generate_live_disease_radar(user_profile)
    return jsonify(alerts)
