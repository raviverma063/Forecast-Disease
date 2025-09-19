from flask import Flask, render_template, jsonify, request
from data_collector import DataCollector
from forecast_model import DiseaseForecaster
import os
from datetime import datetime, timedelta

app = Flask(__name__)

# Initialize components
data_collector = DataCollector()
forecaster = DiseaseForecaster()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    disease = request.args.get('disease', 'influenza')
    location = request.args.get('location', 'US')
    days = int(request.args.get('days', 30))
    
    try:
        # Get historical data
        historical_data = data_collector.get_historical_data(disease, location)
        
        # Generate forecast
        forecast = forecaster.forecast(historical_data, days=days)
        
        return jsonify({
            'status': 'success',
            'disease': disease,
            'location': location,
            'forecast': forecast.to_dict('records')
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
