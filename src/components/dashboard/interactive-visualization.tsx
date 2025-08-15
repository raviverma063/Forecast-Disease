'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { getInteractiveDataInsights } from '@/app/actions';
import { type InteractiveDataInsightsOutput } from '@/ai/flows/interactive-data-insights';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// This chart data is for demonstration; the AI will provide suggestions based on it.
const chartData = [
  { month: 'January', cases: 186 },
  { month: 'February', cases: 305 },
  { month: 'March', cases: 237 },
  { month: 'April', cases: 273 },
  { month: 'May', cases: 209 },
  { month: 'June', cases: 214 },
];

const chartConfig = {
  cases: {
    label: 'Cases',
    color: 'hsl(var(--primary))',
  },
};

export default function InteractiveVisualization() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('What are the current health trends?');
  const [result, setResult] = useState < InteractiveDataInsightsOutput | null > (null);
  const { toast } = useToast();

  // --- ADDED: Load saved data from cache when the component first opens ---
  useEffect(() => {
    const savedQuery = localStorage.getItem('interactiveQuery');
    const savedResult = localStorage.getItem('interactiveResult');
    if (savedQuery) {
      setQuery(JSON.parse(savedQuery));
    }
    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  // --- ADDED: Save new queries and results to the cache whenever they change ---
  useEffect(() => {
    localStorage.setItem('interactiveQuery', JSON.stringify(query));
    if (result) {
      localStorage.setItem('interactiveResult', JSON.stringify(result));
    }
  }, [query, result]);


  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      // --- MODIFIED: Load the user's real profile data from cache ---
      const savedProfile = localStorage.getItem('userProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : {};

      // Create a simple text summary of the profile to send to the AI
      const profileSummary = `
        Current Location: ${profileData.currentDistrict || 'Not specified'},
        Age: ${profileData.dob ? new Date().getFullYear() - new Date(profileData.dob).getFullYear() : 'Not specified'},
        Sex: ${profileData.sex || 'Not specified'},
        Health Conditions: ${profileData.chronicConditions || 'None'},
        Allergies: ${profileData.allergies || 'None'}
      `;

      // Use the real profile data instead of the mock data
      const res = await getInteractiveDataInsights({
        profileData: profileSummary,
        locationData: profileData.currentDistrict || 'Uttar Pradesh, India',
        // The rest can be mock/static for now
        weatherData: '30°C, humid',
        season: 'Monsoon',
        localHealthData: 'Increase in vector-borne diseases',
        governmentHealthData: 'High alert for dengue and malaria',
        environmentRiskData: 'AQI 120, moderate',
        query
      });

      setResult(res);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate insights.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Interactive Data Insights</CardTitle>
        <CardDescription>
          Ask a question to get AI-powered insights from your health data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          placeholder="e.g., What is the risk of malaria this week?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[80px]"
        />
        {loading && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-3">Generating insights...</p>
          </div>
        )}
        {result && (
          <div className="space-y-4">
            <p className="text-sm font-medium">
              <span className="font-semibold">Insight:</span> {result.insight}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Visualization:</span>{' '}
              {result.visualizationSuggestion}
            </p>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="cases" fill="var(--color-cases)" radius={4} />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleQuery} disabled={loading || !query} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Get Insights'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
