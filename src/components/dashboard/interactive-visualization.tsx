'use client';

import { useState } from 'react';
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

const MOCK_INPUT_BASE = {
  profileData: '30-year-old male, no pre-existing conditions',
  locationData: 'New Delhi, India',
  weatherData: '35°C, humid',
  season: 'Post-monsoon',
  localHealthData: 'Increase in dengue cases',
  governmentHealthData: 'High alert for vector-borne diseases',
  environmentRiskData: 'AQI 150, poor',
};

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
  const [result, setResult] = useState<InteractiveDataInsightsOutput | null>(null);
  const { toast } = useToast();

  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await getInteractiveDataInsights({ ...MOCK_INPUT_BASE, query });
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
