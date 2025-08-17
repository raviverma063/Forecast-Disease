from flask import Flask, request, jsonify
import os
import requests

app = Flask(__name__)

@app.route('/api/hospital_finder', methods=['GET'])
def hospital_finder_api():
    # This API is now smart enough to handle GPS coordinates OR a text query.
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    query = request.args.get('query')

    api_key = os.environ.get('GOOGLE_MAPS_API_KEY')
    if not api_key:
        return jsonify({"error": "Google Maps API key is not configured."}), 500

    # --- Logic to decide which Google API to use ---
    if lat and lng:
        # If we have GPS coordinates, use the precise "Nearby Search"
        url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={lat},{lng}&radius=5000&type=hospital&key={api_key}"
    elif query:
        # If we have a text query (like a district name), use "Text Search"
        url = f"https://maps.googleapis.com/maps/api/place/textsearch/json?query=hospitals in {query}&key={api_key}"
    else:
        return jsonify({"error": "Location data (GPS or query) is required."}), 400

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        hospitals = []
        for place in data.get('results', []):
            is_open_data = place.get('opening_hours', {}).get('open_now')
            is_open_status = 'Hours not available' # Default to this
         if is_open_data is True:
            is_open_status = 'Open'
         elif is_open_data is False:
         is_open_status = 'Closed'
            hospitals.append({
                'name': place.get('name'),
                'address': place.get('vicinity') or place.get('formatted_address'),
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
