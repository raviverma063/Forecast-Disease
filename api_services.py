import os
import requests
import openai
from datetime import datetime, timedelta
import json
from typing import Dict, List, Optional
from idsp_integration import IDSPDataService

class APIServices:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        self.rapidapi_key = os.getenv('RAPIDAPI_KEY')
        self.google_maps_api_key = os.getenv('GOOGLE_MAPS_API_KEY')
        self.openweather_api_key = os.getenv('OPENWEATHER_API_KEY')
        self.idsp_api_url = os.getenv('IDSP_API_URL')
        self.idsp_api_key = os.getenv('IDSP_API_KEY')
        
        # Initialize OpenAI client
        if self.openai_api_key:
            openai.api_key = self.openai_api_key
        
        # Initialize IDSP service
        self.idsp_service = IDSPDataService(
            api_key=self.idsp_api_key,
            base_url=self.idsp_api_url
        )

    def get_travel_health_recommendations(self, current_location: str, destination: str, 
                                        travel_date: str, trip_duration: int = 7) -> Dict:
        """Get comprehensive travel health recommendations using OpenAI and other APIs"""
        try:
            # Get weather data for destination
            weather_data = self.get_weather_forecast(destination)
            
            # Get disease outbreak information from IDSP
            outbreak_data = self.get_disease_outbreaks(destination)
            
            # Generate AI-powered health recommendations using Gemini
            ai_recommendations = self.generate_ai_health_advice_gemini(
                current_location, destination, travel_date, trip_duration, 
                weather_data, outbreak_data
            )
            
            return {
                'success': True,
                'destination': destination,
                'travel_date': travel_date,
                'weather': weather_data,
                'outbreaks': outbreak_data,
                'risks': ai_recommendations.get('risks', {}),
                'recommendations': ai_recommendations.get('recommendations', []),
                'emergency_contacts': self.get_emergency_contacts(destination)
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'risks': self.get_fallback_travel_data(destination)
            }

    def generate_ai_health_advice_gemini(self, current_location: str, destination: str, 
                                travel_date: str, trip_duration: int, 
                                weather_data: Dict, outbreak_data: Dict) -> Dict:
        """Use Gemini AI to generate personalized travel health advice"""
        try:
            prompt = f"""
            Generate travel health recommendations for:
            - Current Location: {current_location}
            - Destination: {destination}
            - Travel Date: {travel_date}
            - Trip Duration: {trip_duration} days
            - Weather: {weather_data.get('description', 'Variable')}
            - Disease Outbreaks: {outbreak_data.get('alerts', [])}
            
            Provide response in JSON format:
            {{
                "risks": {{
                    "disease": "low/medium/high",
                    "weather": "low/medium/high",
                    "overall": "low/medium/high"
                }},
                "recommendations": [
                    "specific recommendation 1",
                    "specific recommendation 2",
                    "specific recommendation 3"
                ],
                "vaccinations": ["vaccine1", "vaccine2"],
                "precautions": ["precaution1", "precaution2"]
            }}
            """
            
            response = requests.post(
                f'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={self.gemini_api_key}',
                headers={'Content-Type': 'application/json'},
                json={
                    'contents': [{'parts': [{'text': prompt}]}]
                }
            )
            
            if response.status_code == 200:
                data = response.json()
                gemini_text = data['candidates'][0]['content']['parts'][0]['text']
                
                # Extract JSON from response
                import re
                json_match = re.search(r'\{.*\}', gemini_text, re.DOTALL)
                if json_match:
                    return json.loads(json_match.group())
            
            # Fallback to original method
            return self.generate_ai_health_advice(current_location, destination, travel_date, trip_duration, weather_data, outbreak_data)
            
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self.generate_ai_health_advice(current_location, destination, travel_date, trip_duration, weather_data, outbreak_data)

    def generate_ai_health_advice(self, current_location: str, destination: str, 
                                travel_date: str, trip_duration: int, 
                                weather_data: Dict, outbreak_data: Dict) -> Dict:
        """Use OpenAI to generate personalized travel health advice"""
        if not self.openai_api_key:
            return self.get_fallback_travel_data(destination)
        
        try:
            prompt = f"""
            As a travel health expert, provide comprehensive health recommendations for:
            
            Travel Details:
            - From: {current_location}
            - To: {destination}
            - Date: {travel_date}
            - Duration: {trip_duration} days
            
            Current Weather: {json.dumps(weather_data, indent=2)}
            Disease Outbreaks: {json.dumps(outbreak_data, indent=2)}
            
            Please provide a JSON response with:
            1. Disease risks (array of diseases with risk levels)
            2. Required/recommended vaccinations
            3. Health precautions specific to the destination
            4. Medication recommendations
            5. Food and water safety tips
            
            Format as JSON with keys: risks, vaccinations, precautions, medications, food_safety
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a travel health expert providing medical advice for international travel."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.3
            )
            
            # Parse AI response
            ai_content = response.choices[0].message.content
            try:
                ai_data = json.loads(ai_content)
                return {
                    'risks': {
                        'diseases': [disease['name'] for disease in ai_data.get('risks', [])],
                        'vaccinations': ai_data.get('vaccinations', []),
                        'precautions': ai_data.get('precautions', [])
                    },
                    'recommendations': ai_data.get('medications', []) + ai_data.get('food_safety', [])
                }
            except json.JSONDecodeError:
                # If AI response isn't valid JSON, parse manually
                return self.parse_ai_text_response(ai_content, destination)
                
        except Exception as e:
            print(f"OpenAI API error: {e}")
            return self.get_fallback_travel_data(destination)

    def get_weather_forecast(self, destination: str) -> Dict:
        """Get weather forecast for destination using OpenWeatherMap API"""
        if not self.openweather_api_key:
            return self.get_mock_weather_data(destination)
        
        try:
            # Get coordinates for destination
            geocoding_url = f"http://api.openweathermap.org/geo/1.0/direct"
            geocoding_params = {
                'q': destination,
                'limit': 1,
                'appid': self.openweather_api_key
            }
            
            geo_response = requests.get(geocoding_url, params=geocoding_params)
            geo_data = geo_response.json()
            
            if not geo_data:
                return self.get_mock_weather_data(destination)
            
            lat, lon = geo_data[0]['lat'], geo_data[0]['lon']
            
            # Get weather forecast
            weather_url = f"http://api.openweathermap.org/data/2.5/forecast"
            weather_params = {
                'lat': lat,
                'lon': lon,
                'appid': self.openweather_api_key,
                'units': 'metric'
            }
            
            weather_response = requests.get(weather_url, params=weather_params)
            weather_data = weather_response.json()
            
            return {
                'temperature': weather_data['list'][0]['main']['temp'],
                'humidity': weather_data['list'][0]['main']['humidity'],
                'description': weather_data['list'][0]['weather'][0]['description'],
                'forecast': weather_data['list'][:5]  # 5-day forecast
            }
            
        except Exception as e:
            print(f"Weather API error: {e}")
            return self.get_mock_weather_data(destination)

    def get_disease_outbreaks(self, destination: str) -> Dict:
        """Get current disease outbreak information from IDSP live weekly data"""
        try:
            # Use IDSP service for real government surveillance data
            state = self.map_destination_to_state(destination)
            idsp_data = self.idsp_service.format_for_travel_health(state)
            
            # Get detailed surveillance data
            surveillance_data = self.idsp_service.get_weekly_surveillance_data(state=state)
            alerts = self.idsp_service.get_disease_alerts(state=state)
            
            return {
                'active_outbreaks': idsp_data['high_risk_diseases'] + idsp_data['medium_risk_diseases'],
                'high_risk_diseases': idsp_data['high_risk_diseases'],
                'medium_risk_diseases': idsp_data['medium_risk_diseases'],
                'detailed_alerts': alerts,
                'surveillance_week': idsp_data['surveillance_week'],
                'last_updated': idsp_data['last_updated'],
                'source': 'IDSP - Integrated Disease Surveillance Programme (Govt of India)',
                'raw_surveillance_data': surveillance_data
            }
            
        except Exception as e:
            print(f"IDSP API error: {e}")
            return self.get_idsp_mock_data(destination)

    def fetch_idsp_data(self, destination: str) -> Dict:
        """Fetch real IDSP weekly surveillance data"""
        try:
            # IDSP API endpoints for weekly surveillance data
            headers = {
                'Authorization': f'Bearer {self.idsp_api_key}',
                'Content-Type': 'application/json'
            }
            
            # Get current week's surveillance data
            current_week = datetime.now().isocalendar()[1]
            current_year = datetime.now().year
            
            # IDSP API call for weekly disease surveillance
            url = f"{self.idsp_api_url}weekly-surveillance"
            params = {
                'week': current_week,
                'year': current_year,
                'state': self.map_destination_to_state(destination),
                'format': 'json'
            }
            
            response = requests.get(url, headers=headers, params=params)
            
            if response.status_code == 200:
                data = response.json()
                return self.parse_idsp_response(data, destination)
            else:
                return self.get_idsp_mock_data(destination)
                
        except Exception as e:
            print(f"IDSP fetch error: {e}")
            return self.get_idsp_mock_data(destination)

    def map_destination_to_state(self, destination: str) -> str:
        """Map travel destination to state for IDSP data - Multi-state support"""
        # Extract state from destination if it contains comma
        if ',' in destination:
            district, state = destination.split(', ')
            return state.strip()
        
        # District mappings for all three states
        up_districts = [
            'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya', 'Azamgarh',
            'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti',
            'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah',
            'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad',
            'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun',
            'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi',
            'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri',
            'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit',
            'Pratapgarh', 'Prayagraj', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar',
            'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra',
            'Sultanpur', 'Unnao', 'Varanasi'
        ]
        
        bihar_districts = [
            'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar',
            'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur',
            'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger',
            'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur',
            'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali', 'West Champaran'
        ]
        
        wb_districts = [
            'Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling',
            'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Kolkata', 'Malda',
            'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur',
            'Purba Bardhaman', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'
        ]
        
        if destination in up_districts:
            return 'Uttar Pradesh'
        elif destination in bihar_districts:
            return 'Bihar'
        elif destination in wb_districts:
            return 'West Bengal'
        
        return 'Uttar Pradesh'  # Default fallback

    def parse_idsp_response(self, data: Dict, destination: str) -> Dict:
        """Parse IDSP API response to extract disease outbreak information"""
        try:
            outbreaks = []
            alerts = []
            
            # Parse IDSP surveillance data structure
            if 'surveillance_data' in data:
                for disease_data in data['surveillance_data']:
                    disease_name = disease_data.get('disease_name', '')
                    case_count = disease_data.get('cases_reported', 0)
                    alert_level = disease_data.get('alert_level', 'normal')
                    
                    if alert_level in ['high', 'outbreak'] or case_count > 100:
                        outbreaks.append(disease_name)
                        alerts.append({
                            'disease': disease_name,
                            'cases': case_count,
                            'alert_level': alert_level,
                            'week': disease_data.get('epi_week', ''),
                            'state': disease_data.get('state', '')
                        })
            
            return {
                'active_outbreaks': outbreaks,
                'detailed_alerts': alerts,
                'last_updated': data.get('last_updated', datetime.now().isoformat()),
                'source': 'IDSP - Integrated Disease Surveillance Programme',
                'week': data.get('epi_week', ''),
                'year': data.get('year', datetime.now().year)
            }
            
        except Exception as e:
            print(f"IDSP parsing error: {e}")
            return self.get_idsp_mock_data(destination)

    def get_idsp_mock_data(self, destination: str) -> Dict:
        """Enhanced mock data based on IDSP surveillance patterns - UP specific"""
        # Current epidemiological week
        current_week = datetime.now().isocalendar()[1]
        
        # Multi-state disease surveillance data based on regional patterns
        regional_data = {
            # Uttar Pradesh districts
            'Ghaziabad': {'outbreaks': ['Dengue', 'Chikungunya', 'Typhoid'], 'cases': {'Dengue': 89, 'Chikungunya': 45, 'Typhoid': 23}, 'state': 'Uttar Pradesh'},
            'Gautam Buddha Nagar': {'outbreaks': ['Dengue', 'Viral Fever'], 'cases': {'Dengue': 67, 'Viral Fever': 134}, 'state': 'Uttar Pradesh'},
            'Lucknow': {'outbreaks': ['Dengue', 'Chikungunya', 'Scrub Typhus'], 'cases': {'Dengue': 156, 'Chikungunya': 78, 'Scrub Typhus': 34}, 'state': 'Uttar Pradesh'},
            'Varanasi': {'outbreaks': ['Dengue', 'Chikungunya', 'Kala Azar'], 'cases': {'Dengue': 89, 'Chikungunya': 45, 'Kala Azar': 12}, 'state': 'Uttar Pradesh'},
            'Gorakhpur': {'outbreaks': ['Japanese Encephalitis', 'Dengue', 'Malaria'], 'cases': {'Japanese Encephalitis': 67, 'Dengue': 89, 'Malaria': 45}, 'state': 'Uttar Pradesh'},
            
            # Bihar districts
            'Patna': {'outbreaks': ['Japanese Encephalitis', 'Dengue', 'Kala Azar'], 'cases': {'Japanese Encephalitis': 78, 'Dengue': 134, 'Kala Azar': 45}, 'state': 'Bihar'},
            'Muzaffarpur': {'outbreaks': ['Japanese Encephalitis', 'Acute Encephalitis Syndrome'], 'cases': {'Japanese Encephalitis': 89, 'Acute Encephalitis Syndrome': 67}, 'state': 'Bihar'},
            'Gaya': {'outbreaks': ['Kala Azar', 'Malaria', 'Dengue'], 'cases': {'Kala Azar': 56, 'Malaria': 78, 'Dengue': 45}, 'state': 'Bihar'},
            'Darbhanga': {'outbreaks': ['Japanese Encephalitis', 'Chikungunya'], 'cases': {'Japanese Encephalitis': 67, 'Chikungunya': 34}, 'state': 'Bihar'},
            'Bhagalpur': {'outbreaks': ['Kala Azar', 'Dengue'], 'cases': {'Kala Azar': 45, 'Dengue': 67}, 'state': 'Bihar'},
            
            # West Bengal districts
            'Kolkata': {'outbreaks': ['Dengue', 'Chikungunya', 'Malaria'], 'cases': {'Dengue': 198, 'Chikungunya': 89, 'Malaria': 56}, 'state': 'West Bengal'},
            'Howrah': {'outbreaks': ['Dengue', 'Typhoid'], 'cases': {'Dengue': 123, 'Typhoid': 67}, 'state': 'West Bengal'},
            'Darjeeling': {'outbreaks': ['Malaria', 'Dengue'], 'cases': {'Malaria': 78, 'Dengue': 45}, 'state': 'West Bengal'},
            'Malda': {'outbreaks': ['Kala Azar', 'Japanese Encephalitis'], 'cases': {'Kala Azar': 34, 'Japanese Encephalitis': 23}, 'state': 'West Bengal'},
            'North 24 Parganas': {'outbreaks': ['Dengue', 'Chikungunya'], 'cases': {'Dengue': 156, 'Chikungunya': 78}, 'state': 'West Bengal'}
        }
        
        # Extract district name if destination contains state info
        district_name = destination.split(',')[0].strip() if ',' in destination else destination
        
        # Get district-specific data
        if district_name in regional_data:
            district_data = regional_data[district_name]
            alerts = []
            for disease, cases in district_data['cases'].items():
                alert_level = 'high' if cases > 100 else 'medium' if cases > 50 else 'low'
                alerts.append({
                    'disease': disease,
                    'cases': cases,
                    'alert_level': alert_level,
                    'district': district_name,
                    'state': district_data['state']
                })
            
            return {
                'active_outbreaks': district_data['outbreaks'],
                'detailed_alerts': alerts,
                'last_updated': datetime.now().isoformat(),
                'source': f'IDSP Mock Data - {district_name}, {district_data["state"]}',
                'epi_week': current_week,
                'year': datetime.now().year,
                'district': district_name,
                'state': district_data['state']
            }
        
        # Determine state for general data
        state = self.map_destination_to_state(destination)
        
        # General state-wise data patterns
        state_data = {
            'Uttar Pradesh': {
                'outbreaks': ['Dengue', 'Japanese Encephalitis', 'Chikungunya', 'Malaria', 'Typhoid'],
                'alerts': [
                    {'disease': 'Dengue', 'cases': 234, 'alert_level': 'high'},
                    {'disease': 'Japanese Encephalitis', 'cases': 89, 'alert_level': 'medium'},
                    {'disease': 'Chikungunya', 'cases': 156, 'alert_level': 'medium'}
                ]
            },
            'Bihar': {
                'outbreaks': ['Japanese Encephalitis', 'Kala Azar', 'Dengue', 'Acute Encephalitis Syndrome'],
                'alerts': [
                    {'disease': 'Japanese Encephalitis', 'cases': 167, 'alert_level': 'high'},
                    {'disease': 'Kala Azar', 'cases': 89, 'alert_level': 'medium'},
                    {'disease': 'Dengue', 'cases': 123, 'alert_level': 'medium'}
                ]
            },
            'West Bengal': {
                'outbreaks': ['Dengue', 'Chikungunya', 'Malaria', 'Kala Azar'],
                'alerts': [
                    {'disease': 'Dengue', 'cases': 289, 'alert_level': 'high'},
                    {'disease': 'Chikungunya', 'cases': 134, 'alert_level': 'medium'},
                    {'disease': 'Malaria', 'cases': 78, 'alert_level': 'low'}
                ]
            }
        }
        
        general_data = state_data.get(state, state_data['Uttar Pradesh'])
        
        return {
            'active_outbreaks': general_data['outbreaks'],
            'detailed_alerts': [
                {**alert, 'state': state, 'district': district_name} 
                for alert in general_data['alerts']
            ],
            'last_updated': datetime.now().isoformat(),
            'source': f'IDSP Mock Data - {district_name}, {state}',
            'epi_week': current_week,
            'year': datetime.now().year,
            'district': district_name,
            'state': state,
            'note': f'{state}-specific disease surveillance patterns'
        }

    def get_emergency_contacts(self, destination: str) -> Dict:
        """Get emergency contact numbers for destination"""
        emergency_contacts = {
            'India': {
                'emergency': '112',
                'police': '100',
                'fire': '101',
                'ambulance': '108',
                'tourist_helpline': '1363'
            },
            'Thailand': {
                'emergency': '191',
                'police': '191',
                'fire': '199',
                'ambulance': '1669',
                'tourist_police': '1155'
            },
            'Brazil': {
                'emergency': '190',
                'police': '190',
                'fire': '193',
                'ambulance': '192',
                'tourist_police': '0800-024-0024'
            },
            # Add more countries as needed
        }
        
        return emergency_contacts.get(destination, {
            'emergency': '911',
            'note': 'Contact local authorities or your embassy'
        })

    def find_nearby_hospitals(self, latitude: float, longitude: float, radius: int = 5000) -> List[Dict]:
        """Find nearby hospitals using Google Places API"""
        if not self.google_maps_api_key:
            return self.get_mock_hospital_data()
        
        try:
            url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
            params = {
                'location': f"{latitude},{longitude}",
                'radius': radius,
                'type': 'hospital',
                'key': self.google_maps_api_key
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            hospitals = []
            for place in data.get('results', [])[:10]:  # Limit to 10 results
                hospital_details = self.get_place_details(place['place_id'])
                hospitals.append({
                    'name': place['name'],
                    'address': place.get('vicinity', ''),
                    'rating': place.get('rating', 0),
                    'phone': hospital_details.get('phone', 'N/A'),
                    'website': hospital_details.get('website', ''),
                    'location': place['geometry']['location'],
                    'place_id': place['place_id']
                })
            
            return hospitals
            
        except Exception as e:
            print(f"Google Places API error: {e}")
            return self.get_mock_hospital_data()

    def get_place_details(self, place_id: str) -> Dict:
        """Get detailed information about a place"""
        if not self.google_maps_api_key:
            return {}
        
        try:
            url = "https://maps.googleapis.com/maps/api/place/details/json"
            params = {
                'place_id': place_id,
                'fields': 'formatted_phone_number,website,opening_hours',
                'key': self.google_maps_api_key
            }
            
            response = requests.get(url, params=params)
            data = response.json()
            
            result = data.get('result', {})
            return {
                'phone': result.get('formatted_phone_number', ''),
                'website': result.get('website', ''),
                'hours': result.get('opening_hours', {}).get('weekday_text', [])
            }
            
        except Exception as e:
            print(f"Place details API error: {e}")
            return {}

    def get_fallback_travel_data(self, destination: str) -> Dict:
        """Fallback travel health data when APIs are unavailable"""
        travel_data = {
            'India': {
                'diseases': ['Dengue', 'Malaria', 'Typhoid', 'Hepatitis A'],
                'vaccinations': ['Hepatitis A', 'Typhoid', 'Japanese Encephalitis'],
                'precautions': [
                    'Use mosquito repellent and nets',
                    'Drink only bottled or boiled water',
                    'Eat hot, freshly cooked food',
                    'Avoid street food and raw vegetables'
                ]
            },
            'Thailand': {
                'diseases': ['Dengue', 'Zika', 'Chikungunya', 'Malaria'],
                'vaccinations': ['Hepatitis A', 'Typhoid', 'Japanese Encephalitis'],
                'precautions': [
                    'Use insect repellent containing DEET',
                    'Wear long sleeves and pants in evening',
                    'Stay in air-conditioned or screened accommodations',
                    'Avoid tap water and ice'
                ]
            },
            'Brazil': {
                'diseases': ['Yellow Fever', 'Zika', 'Dengue', 'Malaria'],
                'vaccinations': ['Yellow Fever', 'Hepatitis A', 'Typhoid'],
                'precautions': [
                    'Yellow fever vaccination required for certain areas',
                    'Use mosquito protection measures',
                    'Avoid areas with Zika transmission if pregnant',
                    'Practice safe food and water precautions'
                ]
            }
        }
        
        return travel_data.get(destination, {
            'diseases': ['Traveler\'s Diarrhea'],
            'vaccinations': ['Routine vaccinations up to date'],
            'precautions': ['Follow general travel health guidelines']
        })

    def get_mock_weather_data(self, destination: str) -> Dict:
        """Mock weather data for fallback"""
        return {
            'temperature': 28,
            'humidity': 75,
            'description': 'partly cloudy',
            'forecast': []
        }

    def get_mock_hospital_data(self) -> List[Dict]:
        """Mock hospital data for fallback"""
        return [
            {
                'name': 'City General Hospital',
                'address': '123 Main Street',
                'rating': 4.2,
                'phone': '+1-555-0123',
                'website': 'https://cityhospital.com',
                'location': {'lat': 0, 'lng': 0},
                'place_id': 'mock_place_id_1'
            }
        ]

    def parse_ai_text_response(self, text: str, destination: str) -> Dict:
        """Parse AI text response when JSON parsing fails"""
        # Simple text parsing logic
        return self.get_fallback_travel_data(destination)
