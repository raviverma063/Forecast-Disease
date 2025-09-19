# Disease Forecasting System

A web-based application for predicting disease outbreaks using time series forecasting. This system provides interactive visualizations of historical disease data and forecasts future trends using the Facebook Prophet forecasting model.

## Features

- Interactive dashboard with real-time data visualization
- Support for multiple diseases and locations
- 30-day forecast predictions with confidence intervals
- Key metrics and statistics
- Responsive design for desktop and mobile devices

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Node.js and npm (for optional frontend development)

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd disease-forecast
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the Flask development server:
   ```bash
   python app.py
   ```

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

## Project Structure

```
disease-forecast/
├── app.py                 # Main application entry point
├── data_collector.py      # Data collection and processing
├── forecast_model.py      # Forecasting model implementation
├── requirements.txt       # Python dependencies
├── README.md              # This file
└── templates/             # HTML templates
    └── index.html         # Main dashboard page
```

## Configuration

The application can be configured using environment variables. Create a `.env` file in the project root:

```
# Flask configuration
FLASK_APP=app.py
FLASK_ENV=development

# API Keys (if needed)
# WEATHER_API_KEY=your_api_key_here
# DISEASE_API_KEY=your_api_key_here
```

## Usage

1. Select a disease from the dropdown menu
2. Choose a location
3. Set the forecast period (in days)
4. Click "Generate Forecast" to view predictions

## Customizing the Model

You can adjust the forecasting model parameters in `forecast_model.py`. The `DiseaseForecaster` class accepts a `model_params` dictionary with the following options:

- `changepoint_prior_scale`: Controls flexibility of trend changes
- `seasonality_prior_scale`: Controls flexibility of seasonality
- `seasonality_mode`: 'additive' or 'multiplicative'
- `yearly_seasonality`: Fit yearly seasonality
- `weekly_seasonality`: Fit weekly seasonality
- `daily_seasonality`: Fit daily seasonality

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Flask](https://flask.palletsprojects.com/)
- Forecasting powered by [Prophet](https://facebook.github.io/prophet/)
- Data visualization with [Plotly.js](https://plotly.com/javascript/)
- UI components from [Bootstrap 5](https://getbootstrap.com/)
