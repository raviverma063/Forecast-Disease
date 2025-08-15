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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, ComposedChart, Tooltip } from 'recharts';
import { Loader2, AlertTriangle, ShieldCheck, Info, MapPin, TrendingUp, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// --- Helper function to get the right color and icon for the risk level ---
const getRiskAppearance = (riskLevel) => {
    const level = riskLevel || "Low"; // Use "Low" as a default if no risk level exists
    switch (level.toLowerCase()) {
        case 'high':
            return { color: 'text-red-400', Icon: AlertTriangle };
        case 'moderate':
            return { color: 'text-orange-400', Icon: ShieldCheck };
        default:
            return { color: 'text-green-400', Icon: Info };
    }
};

// --- MOCK CHART DATA ---
const chartData = [
  { month: 'Mar', cases: 237, temp: 30, rainfall: 5, risk: 'Low' },
  { month: 'Apr', cases: 273, temp: 35, rainfall: 10, risk: 'Low' },
  { month: 'May', cases: 209, temp: 38, rainfall: 20, risk: 'Moderate' },
  { month: 'Jun', cases: 214, temp: 36, rainfall: 150, risk: 'Moderate' },
  { month: 'Jul', cases: 310, temp: 32, rainfall: 300, risk: 'High' },
  { month: 'Aug', cases: 420, temp: 31, rainfall: 350, risk: 'High' },
];

const getRiskColor = (risk) => {
    if (risk === 'High') return 'hsl(var(--destructive))';
    if (risk === 'Moderate') return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
}

export default function InteractiveVisualization() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('What are the current health trends?');
  const [result, setResult] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedQuery = localStorage.getItem('interactiveQuery');
    const savedResult = localStorage.getItem('interactiveResult');
    if (savedQuery) setQuery(JSON.parse(savedQuery));
    if (savedResult) setResult(JSON.parse(savedResult));
  }, []);

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
      const savedProfile = localStorage.getItem('userProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : {};

      const response = await fetch('/api/predictor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profileData, query }),
      });

      if (!response.ok) {
          throw new Error('Failed to get analysis from the server.');
      }

      const res = await response.json();
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
  
  // This function will render the results only when they exist
  const renderResult = () => {
    if (!result) return null;

    const { color, Icon } = getRiskAppearance(result.riskLevel);

    return (
      <div className="space-y-4">
        {/* --- PERSONALIZED RISK SCORE --- */}
        <div className="p-4 bg-gray-800/50 rounded-lg text-center">
            <p className="text-sm text-gray-400">Your Personal Risk Score</p>
            <p className={`text-4xl font-bold ${result.personalRiskScore > 70 ? 'text-red-500' : result.personalRiskScore > 40 ? 'text-orange-400' : 'text-green-400'}`}>
                {result.personalRiskScore}/100
            </p>
            <p className="text-xs text-gray-500">Based on your profile, location, and current conditions.</p>
        </div>

        {/* --- ACTION-ORIENTED INSIGHT --- */}
        <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
            <div className="flex justify-between text-xs font-medium text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={12} /> {result.location}</span>
                <span className={`flex items-center gap-1 ${result.riskLevel === 'High' ? 'text-red-400' : 'text-orange-400'}`}><AlertTriangle size={12} /> Risk: {result.riskLevel}</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} /> Trend: {result.trend}</span>
            </div>
            <p className="text-sm text-gray-300">{result.insight} <span className="font-semibold">{result.riskWindow}</span></p>
            <div>
                <h4 className="font-semibold text-gray-200 text-sm mb-2">Immediate Actions:</h4>
                <ul className="space-y-1 text-xs text-gray-400">
                    {result.actions && result.actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2"><span>•</span>{action}</li>
                    ))}
                </ul>
            </div>
        </div>

        {/* --- INFORMATIVE VISUALIZATION --- */}
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-semibold text-gray-200 text-sm mb-2">Seasonal Trend & Environmental Factors</h4>
             <ChartContainer config={{}} className="h-[200px] w-full">
                <ComposedChart data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.3}/>
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} fontSize={12} />
                    <YAxis yAxisId="left" orientation="left" stroke="#888888" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar yAxisId="left" dataKey="cases" name="Cases" radius={4}>
                        {chartData.map((entry, index) => (
                            <rect key={`cell-${index}`} fill={getRiskColor(entry.risk)} />
                        ))}
                    </Bar>
                    <Line yAxisId="right" type="monotone" dataKey="temp" name="Temp (°C)" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} />
                </ComposedChart>
            </ChartContainer>
        </div>
        
        {/* --- LOCAL RESOURCES --- */}
        <div className="grid grid-cols-2 gap-2 text-xs">
            <Button variant="outline" size="sm" className="w-full">Find Nearest Fever Clinic</Button>
            <Button variant="outline" size="sm" className="w-full flex items-center gap-1"><Phone size={12}/> Emergency Helpline: 108</Button>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Interactive Data Insights</CardTitle>
        <CardDescription>
          Ask a question to get a personalized, AI-powered risk assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          placeholder="e.g., What is my risk for dengue this month?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[60px]"
        />
        {loading && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-3">Generating personalized insights...</p>
          </div>
        )}
        {renderResult()}
      </CardContent>
      <CardFooter>
        <Button onClick={handleQuery} disabled={loading || !query} className="w-full">
          {loading ? 'Analyzing...' : 'Get Personalized Insights'}
        </Button>
      </CardFooter>
    </Card>
  );
}
