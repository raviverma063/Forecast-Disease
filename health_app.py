from flask import Flask, render_template, request, jsonify, session
import os
from dotenv import load_dotenv
from database import SupabaseClient
from api_services import APIServices
import json
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'your-secret-key-change-in-production')

# Initialize services
db = SupabaseClient()
api_services = APIServices()

# Routes
@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/travel')
def travel():
    return render_template('travel.html')

@app.route('/emergency')
def emergency():
    return render_template('emergency.html')

@app.route('/community')
def community():
    return render_template('community.html')

# API Routes
@app.route('/api/profile', methods=['POST'])
def save_profile():
    try:
        data = request.json
        
        # Transform lifestyle habits to individual boolean fields
        lifestyle_habits = data.get('lifestyle_habits', [])
        profile_data = {
            'name': data['name'],
            'age': data['age'],
            'gender': data['gender'],
            'location': data['location'],
            'chronic_conditions': data.get('chronic_conditions', []),
            'occupation': data.get('occupation', ''),
            'lifestyle_smoking': 'smoking' in lifestyle_habits,
            'lifestyle_alcohol': 'alcohol' in lifestyle_habits,
            'sleep_hours': data.get('sleep_hours', 8)  # Default to 8 hours
        }
        
        user_id = session.get('user_id')
        if user_id:
            # Update existing profile
            result = db.update_user_profile(user_id, profile_data)
        else:
            # Create new profile
            result = db.create_user_profile(profile_data)
            if result['status'] == 'success' and result['data']:
                session['user_id'] = result['data']['id']
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    user_id = session.get('user_id', 1)  # Default to user 1 for demo
    
    result = db.get_user_profile(user_id)
    if result['status'] == 'success':
        profile = result['data']
        # Transform back to frontend format
        lifestyle_habits = []
        if profile.get('lifestyle_smoking'):
            lifestyle_habits.append('smoking')
        if profile.get('lifestyle_alcohol'):
            lifestyle_habits.append('alcohol')
        
        return jsonify({
            'id': profile['id'],
            'name': profile['name'],
            'age': profile['age'],
            'gender': profile['gender'],
            'location': profile['location'],
            'chronic_conditions': profile.get('chronic_conditions', []),
            'occupation': profile.get('occupation', ''),
            'lifestyle_habits': lifestyle_habits,
            'sleep_hours': profile.get('sleep_hours', 8)
        })
    else:
        return jsonify(result), 404

@app.route('/api/health-alerts')
def get_health_alerts():
    user_id = session.get('user_id')
    user_location = None
    
    # Get user location for regional alerts
    if user_id:
        profile_result = db.get_user_profile(user_id)
        if profile_result['status'] == 'success':
            user_location = profile_result['data'].get('location', '')
    
    # Get health alerts from database
    result = db.get_health_alerts(region=user_location, limit=10)
    
    if result['status'] == 'success':
        # Transform database alerts to frontend format
        alerts = []
        for alert in result['data']:
            alerts.append({
                'type': alert.get('alert_type', 'general'),
                'disease': alert['title'],
                'severity': alert['severity'],
                'message': alert['description'],
                'region': alert['region'],
                'date': alert['date'],
                'tips': []  # Could be expanded to include tips from database
            })
        return jsonify(alerts)
    else:
        # Fallback to mock data if database fails
        alerts = [
            {
                'type': 'seasonal',
                'disease': 'Influenza',
                'severity': 'medium',
                'message': 'Flu season is approaching. Consider getting vaccinated.',
                'tips': ['Get flu vaccination', 'Wash hands frequently', 'Avoid crowded places']
            },
            {
                'type': 'environmental',
                'disease': 'Air Quality',
                'severity': 'low',
                'message': 'Air quality is good today.',
                'tips': ['Great day for outdoor activities', 'Keep windows open for fresh air']
            }
        ]
        return jsonify(alerts)

@app.route('/api/travel-health', methods=['POST'])
def get_travel_health():
    """Get comprehensive travel health recommendations"""
    try:
        data = request.get_json()
        current_location = data.get('current_location')
        state = data.get('state')
        destination = data.get('destination')
        travel_date = data.get('travel_date')
        trip_duration = int(data.get('trip_duration', 7))
        
        # Get travel health recommendations using API services
        recommendations = api_services.get_travel_health_recommendations(
            current_location, f"{destination}, {state}", travel_date, trip_duration
        )
        
        return jsonify(recommendations)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'risks': api_services.get_fallback_travel_data(data.get('destination', 'Unknown'))
        }), 500

@app.route('/api/nearby-hospitals', methods=['POST'])
def get_nearby_hospitals():
    """Find nearby hospitals using Google Places API"""
    try:
        data = request.get_json()
        latitude = float(data.get('latitude'))
        longitude = float(data.get('longitude'))
        radius = int(data.get('radius', 5000))
        
        hospitals = api_services.find_nearby_hospitals(latitude, longitude, radius)
        
        return jsonify({
            'success': True,
            'hospitals': hospitals
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'hospitals': api_services.get_mock_hospital_data()
        }), 500

@app.route('/api/risk-assessment')
def get_risk_assessment():
    user_id = session.get('user_id', 1)
    
    # Get user profile from Supabase
    result = db.get_user_profile(user_id)
    
    if result['status'] != 'success':
        return jsonify({'risk_level': 'unknown', 'score': 0})
    
    user = result['data']
    
    # Enhanced risk calculation based on new schema
    age = user['age']
    chronic_conditions = user.get('chronic_conditions', [])
    lifestyle_smoking = user.get('lifestyle_smoking', False)
    lifestyle_alcohol = user.get('lifestyle_alcohol', False)
    sleep_hours = user.get('sleep_hours', 8)
    
    risk_score = 0
    
    # Age-based risk
    if age > 65:
        risk_score += 30
    elif age > 45:
        risk_score += 15
    elif age > 30:
        risk_score += 5
    
    # Chronic conditions risk
    risk_score += len(chronic_conditions) * 20
    
    # Lifestyle risk factors
    if lifestyle_smoking:
        risk_score += 25
    if lifestyle_alcohol:
        risk_score += 10
    
    # Sleep risk
    if sleep_hours < 6 or sleep_hours > 9:
        risk_score += 15
    
    # Determine risk level
    if risk_score >= 60:
        risk_level = 'high'
        color = 'red'
        recommendations = [
            'Consult healthcare provider immediately',
            'Consider lifestyle modifications',
            'Regular health monitoring required'
        ]
    elif risk_score >= 30:
        risk_level = 'medium'
        color = 'yellow'
        recommendations = [
            'Schedule regular health checkups',
            'Maintain healthy lifestyle habits',
            'Monitor chronic conditions closely'
        ]
    else:
        risk_level = 'low'
        color = 'green'
        recommendations = [
            'Continue healthy lifestyle',
            'Annual health checkups',
            'Stay updated with vaccinations'
        ]
    
    return jsonify({
        'risk_level': risk_level,
        'score': risk_score,
        'color': color,
        'recommendations': recommendations
    })

@app.route('/api/travel-health', methods=['POST'])
def get_travel_health():
    data = request.json
    current_location = data.get('current_location')
    destination = data.get('destination')
    travel_date = data.get('travel_date')
    
    # Mock travel health data
    travel_risks = {
        'India': {
            'diseases': ['Dengue', 'Malaria', 'Typhoid'],
            'vaccinations': ['Hepatitis A', 'Typhoid', 'Japanese Encephalitis'],
            'precautions': ['Use mosquito repellent', 'Drink bottled water', 'Avoid street food']
        },
        'Thailand': {
            'diseases': ['Dengue', 'Zika', 'Chikungunya'],
            'vaccinations': ['Hepatitis A', 'Typhoid'],
            'precautions': ['Use mosquito repellent', 'Wear long sleeves', 'Stay in air-conditioned rooms']
        },
        'Brazil': {
            'diseases': ['Yellow Fever', 'Zika', 'Dengue'],
            'vaccinations': ['Yellow Fever', 'Hepatitis A'],
            'precautions': ['Use mosquito repellent', 'Avoid pregnancy if planning', 'Get travel insurance']
        }
    }
    
    destination_info = travel_risks.get(destination, {
        'diseases': ['Common cold', 'Traveler\'s diarrhea'],
        'vaccinations': ['Routine vaccinations up to date'],
        'precautions': ['Practice good hygiene', 'Stay hydrated', 'Get adequate rest']
    })
    
    return jsonify({
        'destination': destination,
        'travel_date': travel_date,
        'risks': destination_info
    })

@app.route('/api/audio-summary')
def get_audio_summary():
    user_id = session.get('user_id', 1)
    
    # Generate daily health summary text
    summary_text = f"""
    Good morning! Here's your daily health update for {datetime.now().strftime('%B %d, %Y')}.
    
    Your current health risk level is moderate. Remember to take your prescribed medications 
    and maintain your healthy lifestyle habits.
    
    Today's weather is suitable for outdoor activities. Consider taking a 30-minute walk 
    to boost your cardiovascular health.
    
    Flu season reminder: Make sure you're up to date with your vaccinations.
    
    Stay hydrated and have a healthy day!
    """
    
    return jsonify({
        'summary_text': summary_text.strip(),
        'audio_url': '/static/audio/daily_summary.mp3'  # Mock audio file
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
