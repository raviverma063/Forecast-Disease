import pandas as pd
import numpy as np
from prophet import Prophet
from sklearn.metrics import mean_absolute_error, mean_squared_error
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DiseaseForecaster:
    def __init__(self, model_params=None):
        """
        Initialize the disease forecaster
        
        Args:
            model_params (dict, optional): Parameters for the Prophet model
        """
        self.model_params = model_params or {
            'changepoint_prior_scale': 0.05,
            'seasonality_prior_scale': 10.0,
            'seasonality_mode': 'multiplicative',
            'yearly_seasonality': True,
            'weekly_seasonality': True,
            'daily_seasonality': False
        }
        self.model = None
    
    def prepare_data(self, data):
        """
        Prepare data for forecasting
        
        Args:
            data (pd.DataFrame): Historical data with 'date' and 'cases' columns
            
        Returns:
            pd.DataFrame: Prepared data for Prophet
        """
        # Ensure we have the required columns
        if 'date' not in data.columns or 'cases' not in data.columns:
            raise ValueError("Input data must contain 'date' and 'cases' columns")
        
        # Convert date to datetime if it's not already
        data = data.copy()
        data['date'] = pd.to_datetime(data['date'])
        
        # Prepare data for Prophet
        prophet_data = data[['date', 'cases']].rename(columns={
            'date': 'ds',
            'cases': 'y'
        })
        
        return prophet_data
    
    def train(self, data):
        """
        Train the forecasting model
        
        Args:
            data (pd.DataFrame): Historical data
            
        Returns:
            Prophet: Trained Prophet model
        """
        # Prepare data
        prophet_data = self.prepare_data(data)
        
        # Initialize and train model
        self.model = Prophet(**self.model_params)
        self.model.fit(prophet_data)
        
        return self.model
    
    def forecast(self, data, days=30):
        """
        Generate forecasts
        
        Args:
            data (pd.DataFrame): Historical data
            days (int): Number of days to forecast
            
        Returns:
            pd.DataFrame: Forecast results with confidence intervals
        """
        if self.model is None:
            self.train(data)
        
        # Create future dataframe
        future = self.model.make_future_dataframe(periods=days)
        
        # Generate forecast
        forecast = self.model.predict(future)
        
        # Format output
        forecast = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].rename(columns={
            'ds': 'date',
            'yhat': 'predicted_cases',
            'yhat_lower': 'lower_bound',
            'yhat_upper': 'upper_bound'
        })
        
        # Add actual values for historical period
        history = self.prepare_data(data)
        forecast = forecast.merge(
            history.rename(columns={'y': 'actual_cases'}),
            on='date',
            how='left'
        )
        
        # Calculate prediction error for historical period
        if 'actual_cases' in forecast.columns:
            forecast['error'] = forecast['actual_cases'] - forecast['predicted_cases']
        
        return forecast
    
    def evaluate(self, data, forecast_days=30):
        """
        Evaluate model performance using historical data
        
        Args:
            data (pd.DataFrame): Full historical data
            forecast_days (int): Number of days to use for evaluation
            
        Returns:
            dict: Evaluation metrics
        """
        # Split data into training and test sets
        split_date = data['date'].max() - pd.Timedelta(days=forecast_days)
        train_data = data[data['date'] <= split_date]
        test_data = data[data['date'] > split_date]
        
        # Train model on training data
        self.train(train_data)
        
        # Generate forecast for test period
        forecast = self.forecast(train_data, days=forecast_days)
        
        # Calculate metrics
        actual = test_data.set_index('date')['cases']
        predicted = forecast.set_index('date')['predicted_cases']
        
        # Only compare dates that exist in both actual and predicted
        common_dates = actual.index.intersection(predicted.index)
        actual = actual[common_dates]
        predicted = predicted[common_dates]
        
        metrics = {
            'mae': mean_absolute_error(actual, predicted),
            'rmse': np.sqrt(mean_squared_error(actual, predicted)),
            'mape': np.mean(np.abs((actual - predicted) / actual)) * 100
        }
        
        return metrics
