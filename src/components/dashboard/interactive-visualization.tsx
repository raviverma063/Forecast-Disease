'use client';

import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart } from 'recharts';
import { getInteractiveDataInsights } from '@/app/actions';
import { type InteractiveDataInsightsOutput } from '@/ai/flows/interactive-data-insights';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InteractiveVisualization() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('What are the current health trends?');
  const [result, setResult] = useState<InteractiveDataInsightsOutput | null>(null);
  const [chartData, setChartData] = useState([]);
  const { toast } = useToast();

  // Load cached data on mount
  useEffect(() => {
    const savedQuery = localStorage.getItem('interactiveQuery');
    const savedResult = localStorage.getItem('interactiveResult');
    if (savedQuery) setQuery(JSON.parse(savedQuery));
    if (savedResult) setResult(JSON.parse(savedResult));
  }, []);

  // Save to cache when updated
  useEffect(() => {
    localStorage.setItem('interactiveQuery', JSON.stringify(query));
    if (result) localStorage.setItem('interactiveResult', JSON.stringify(result));
  }, [query, result]);

  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);

    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : {};

      const profileSummary = `
        Location: ${profileData.currentDistrict || 'Not specified'},
        Age: ${profileData.dob ? new Date().getFullYear() - new Date(profileData.dob).getFullYear() : 'Not specified'},
        Sex: ${profileData.sex || 'Not specified'},
        Conditions: ${profileData.chronicConditions || 'None'},
        Allergies: ${profileData.allergies || 'None'}
      `;

      const res = await getInteractiveDataInsights({
        profileData: profileSummary,
        locationData: profileData.currentDistrict || 'Uttar Pradesh, India',
        weatherData: '30°C, humid',
        season: 'Monsoon',
        localHealthData: 'Increase in vector-borne diseases',
        governmentHealthData: 'High alert for dengue and malaria',
        environmentRiskData: 'AQI 120, moderate',
        query
      });

      setResult(res);
      setChartData(res.chartData || []);

      // Save risk history
      const history = JSON.parse(localStorage.getItem('riskHistory') || '[]');
      history.push({ date: new Date().toISOString(), risk: res.riskScore });
      localStorage.setItem('riskHistory', JSON.stringify(history));

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to generate insights.' });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Interactive Health Risk Dashboard</CardTitle>
        <CardDescription>AI-powered local health trends, risks, and prevention steps.</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Query Box */}
        <Textarea
          placeholder="e.g., What is the malaria risk this week?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[80px]"
        />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-3">Analyzing health data...</p>
          </div>
        )}

        {/* Result Section */}
        {result && (
          <div className="space-y-4">
            {/* Risk Score & Level */}
            <div className="flex items-center gap-4 p-3 rounded-lg border bg-muted">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full">
                  <circle cx="32" cy="32" r="28" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                  <circle
                    cx="32" cy="32" r="28"
                    stroke={result.riskLevel === 'High' ? '#f87171' : '#fbbf24'}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${(result.riskScore / 100) * 176} 176`}
                    strokeLinecap="round"
                    transform="rotate(-90 32 32)"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-bold text-lg">{result.riskScore}</span>
              </div>
              <div>
                <p className="font-semibold">{result.riskLevel} Risk</p>
                <p className="text-sm text-gray-500">{result.trend} trend | {result.timeFrame}</p>
              </div>
              {result.riskLevel === 'High' ? (
                <AlertTriangle className="text-red-500 ml-auto" />
              ) : (
                <CheckCircle2 className="text-green-500 ml-auto" />
              )}
            </div>

            {/* Insight */}
            <p className="text-sm font-medium">
              <span className="font-semibold">Insight:</span> {result.insightSummary}
            </p>

            {/* Action Steps */}
            <div className="p-3 rounded-lg border bg-muted">
              <p className="font-semibold mb-2">Immediate Actions:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {result.immediateActions?.map((action: string, idx: number) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>

            {/* Chart */}
            <ChartContainer className="h-[200px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="cases" fill={result.riskLevel === 'High' ? '#f87171' : '#60a5fa'} radius={4} />
              </BarChart>
            </ChartContainer>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => window.open('/fogging-schedule')}>Mosquito Fogging Near Me</Button>
              <Button variant="outline" onClick={() => alert('Alerts enabled!')}>Set Weekly Alerts</Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={handleQuery} disabled={loading || !query} className="w-full">
          {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>) : 'Get Insights'}
        </Button>
      </CardFooter>
    </Card>
  );
}
