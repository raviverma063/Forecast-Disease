from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

@app.route('/api/hospital_finder', methods=['GET'])
def hospital_finder_api():
    """
    Fetches nearby hospitals using the user's current location.
    """
    # --- 1. Get User's Location from the Request ---
    lat = request.args.get('lat')
    lng = request.args.get('lng')

    if not lat or not lng:
        return jsonify({"error": "Latitude and longitude are required."}), 400

    # --- 2. Get the Secure API Key from Vercel's Settings ---
    api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
    if not api_key:
        return jsonify({"error": "Google Maps API key is not configured."}), 500

    # --- 3. Construct the Google Places API Request ---
    radius = 5000  # Search within a 5km radius
    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius={radius}&type=hospital&key={api_key}"

    try:
        # --- 4. Call the Google API and Get the Results ---
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        # --- 5. Format the Results for Our Website ---
        hospitals = []
        for place in data.get('results', []):
            is_open_data = place.get('opening_hours', {}).get('open_now')
            is_open_status = 'N/A'
            if is_open_data is True:
                is_open_status = 'Open'
            elif is_open_data is False:
                is_open_status = 'Closed'

            hospitals.append({
                'name': place.get('name'),
                'address': place.get('vicinity'),
                'rating': place.get('rating', 'N/A'),
                'is_open': is_open_status,
                'maps_url': f"https://www.google.com/maps/search/?api=1&query={place.get('name')}&query_place_id={place.get('place_id')}"
            })
        
        return jsonify(hospitals)

    except requests.exceptions.RequestException as e:
        print(f"Error calling Google Places API: {e}")
        return jsonify({"error": "Failed to fetch data from Google Maps."}), 502
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500
