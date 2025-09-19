# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click "New Project" and fill in the details:
   - Project Name: `health-dashboard`
   - Database Password: Choose a strong password
   - Region: Select closest to your location
3. Wait for the project to be created (takes ~2 minutes)

## 2. Get Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## 3. Configure Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-anon-key-here
   ```

## 4. Create Database Tables

1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `database_schema.sql`
3. Click "Run" to execute the SQL commands

This will create:
- **UserProfile** table with all required fields
- **HealthAlerts** table with sample data
- Proper indexes for performance
- Row Level Security policies

## 5. Install Dependencies

Run the following command to install required Python packages:

```bash
pip install -r health_requirements.txt
```

## 6. Test the Connection

1. Start the Flask application:
   ```bash
   python health_app.py
   ```

2. Open your browser to `http://localhost:5001`
3. Try creating a user profile to test the database connection

## Database Schema Overview

### UserProfile Table
- `id`: Primary key (auto-increment)
- `name`: User's full name
- `age`: User's age
- `gender`: User's gender
- `location`: User's location
- `chronic_conditions`: Array of chronic conditions
- `occupation`: User's occupation
- `lifestyle_smoking`: Boolean for smoking habit
- `lifestyle_alcohol`: Boolean for alcohol consumption
- `sleep_hours`: Average sleep hours per night

### HealthAlerts Table
- `id`: Primary key (auto-increment)
- `title`: Alert title
- `description`: Alert description
- `region`: Geographic region for the alert
- `date`: Alert date
- `severity`: Alert severity (low, medium, high)
- `alert_type`: Type of alert (seasonal, environmental, etc.)
- `is_active`: Whether the alert is currently active

## Security Features

- Row Level Security (RLS) enabled on both tables
- Users can only access their own profile data
- Health alerts are publicly readable but only for active alerts
- Anon key provides limited access as configured by RLS policies

## Troubleshooting

### Connection Issues
- Verify your SUPABASE_URL and SUPABASE_KEY are correct
- Check that your Supabase project is active
- Ensure your internet connection is stable

### Database Errors
- Make sure you've run the SQL schema in Supabase SQL Editor
- Check that RLS policies are properly configured
- Verify table names match exactly (case-sensitive)

### Python Package Issues
- Make sure you're using Python 3.8+
- Try upgrading pip: `pip install --upgrade pip`
- Install packages one by one if bulk install fails
