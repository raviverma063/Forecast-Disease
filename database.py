import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Dict, List, Optional, Any
import json

# Load environment variables
load_dotenv()

class SupabaseDB:
    def __init__(self):
        """Initialize Supabase client"""
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_KEY')
        
        if not self.url or not self.key:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables")
        
        self.supabase: Client = create_client(self.url, self.key)
    
    def create_user_profile(self, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new user profile"""
        try:
            # Convert chronic_conditions list to PostgreSQL array format
            if 'chronic_conditions' in profile_data and isinstance(profile_data['chronic_conditions'], list):
                profile_data['chronic_conditions'] = profile_data['chronic_conditions']
            
            result = self.supabase.table('UserProfile').insert(profile_data).execute()
            return {'status': 'success', 'data': result.data[0] if result.data else None}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_user_profile(self, user_id: int) -> Dict[str, Any]:
        """Get user profile by ID"""
        try:
            result = self.supabase.table('UserProfile').select('*').eq('id', user_id).execute()
            if result.data:
                return {'status': 'success', 'data': result.data[0]}
            else:
                return {'status': 'error', 'message': 'User not found'}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def update_user_profile(self, user_id: int, profile_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update user profile"""
        try:
            # Convert chronic_conditions list to PostgreSQL array format
            if 'chronic_conditions' in profile_data and isinstance(profile_data['chronic_conditions'], list):
                profile_data['chronic_conditions'] = profile_data['chronic_conditions']
            
            result = self.supabase.table('UserProfile').update(profile_data).eq('id', user_id).execute()
            return {'status': 'success', 'data': result.data[0] if result.data else None}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_health_alerts(self, region: Optional[str] = None, limit: int = 10) -> Dict[str, Any]:
        """Get health alerts, optionally filtered by region"""
        try:
            query = self.supabase.table('HealthAlerts').select('*').eq('is_active', True)
            
            if region:
                query = query.ilike('region', f'%{region}%')
            
            result = query.order('date', desc=True).limit(limit).execute()
            return {'status': 'success', 'data': result.data}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def create_health_alert(self, alert_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new health alert"""
        try:
            result = self.supabase.table('HealthAlerts').insert(alert_data).execute()
            return {'status': 'success', 'data': result.data[0] if result.data else None}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_health_alerts_by_severity(self, severity: str) -> Dict[str, Any]:
        """Get health alerts by severity level"""
        try:
            result = self.supabase.table('HealthAlerts').select('*').eq('severity', severity).eq('is_active', True).execute()
            return {'status': 'success', 'data': result.data}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def search_users_by_location(self, location: str) -> Dict[str, Any]:
        """Search users by location (for community features)"""
        try:
            result = self.supabase.table('UserProfile').select('id, name, location').ilike('location', f'%{location}%').execute()
            return {'status': 'success', 'data': result.data}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_users_with_chronic_condition(self, condition: str) -> Dict[str, Any]:
        """Get users with a specific chronic condition (for community features)"""
        try:
            # Using PostgreSQL array contains operator
            result = self.supabase.table('UserProfile').select('id, name, location').contains('chronic_conditions', [condition]).execute()
            return {'status': 'success', 'data': result.data}
        except Exception as e:
            return {'status': 'error', 'message': str(e)}
    
    def get_lifestyle_statistics(self) -> Dict[str, Any]:
        """Get aggregated lifestyle statistics"""
        try:
            # Get smoking statistics
            smoking_result = self.supabase.table('UserProfile').select('lifestyle_smoking').execute()
            
            # Get alcohol statistics
            alcohol_result = self.supabase.table('UserProfile').select('lifestyle_alcohol').execute()
            
            # Get sleep statistics
            sleep_result = self.supabase.table('UserProfile').select('sleep_hours').execute()
            
            total_users = len(smoking_result.data) if smoking_result.data else 0
            smokers = sum(1 for user in smoking_result.data if user.get('lifestyle_smoking')) if smoking_result.data else 0
            drinkers = sum(1 for user in alcohol_result.data if user.get('lifestyle_alcohol')) if alcohol_result.data else 0
            
            avg_sleep = 0
            if sleep_result.data:
                sleep_hours = [user.get('sleep_hours', 0) for user in sleep_result.data if user.get('sleep_hours')]
                avg_sleep = sum(sleep_hours) / len(sleep_hours) if sleep_hours else 0
            
            return {
                'status': 'success',
                'data': {
                    'total_users': total_users,
                    'smoking_percentage': (smokers / total_users * 100) if total_users > 0 else 0,
                    'alcohol_percentage': (drinkers / total_users * 100) if total_users > 0 else 0,
                    'average_sleep_hours': round(avg_sleep, 1)
                }
            }
        except Exception as e:
            return {'status': 'error', 'message': str(e)}

# Initialize database instance
db = SupabaseDB()
