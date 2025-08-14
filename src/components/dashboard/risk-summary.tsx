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
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getRiskFactorSummary } from '@/app/actions';
import { type RiskFactorSummaryOutput } from '@/ai/flows/risk-factor-summary';
import { Loader2, ShieldAlert, ShieldCheck, ShieldHalf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_INPUT = {
  profileData: 'Healthy 30-year-old, no chronic conditions, exercises regularly.',
  location: 'New Delhi, India',
  weatherData: '35°C, humid, post-monsoon season.',
  localHealthData: 'Recent increase in dengue and malaria cases reported.',
  governmentHealthData: 'IDSP reports active vector-borne disease transmission in the region.',
  environmentRiskData: 'High air pollution (AQI 150), stagnant water observed in some areas.',
};

export default function RiskSummary() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskFactorSummaryOutput | null>(null);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await getRiskFactorSummary(MOCK_INPUT);
      setResult(res);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate risk summary.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskUI = (level: 'High' | 'Moderate' | 'Low' | undefined) => {
    switch (level) {
      case 'High':
        return {
          Icon: ShieldAlert,
          color: 'text-destructive',
          progressColor: 'bg-destructive',
          value: 90,
        };
      case 'Moderate':
        return {
          Icon: ShieldHalf,
          color: 'text-yellow-500',
          progressColor: 'bg-yellow-500',
          value: 60,
        };
      case 'Low':
        return {
          Icon: ShieldCheck,
          color: 'text-green-500',
          progressColor: 'bg-green-500',
          value: 30,
        };
      default:
        return {
          Icon: ShieldCheck,
          color: 'text-muted-foreground',
          progressColor: 'bg-primary',
          value: 0,
        };
    }
  };

  const riskUI = getRiskUI(result?.riskLevel);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Risk Summary</CardTitle>
        <CardDescription>
          AI-powered analysis of your disease risk factors based on your profile and live data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {result && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <riskUI.Icon className={`h-10 w-10 ${riskUI.color}`} />
                <div className="flex-1">
                  <p className="font-bold text-lg">Overall Risk Level: {result.riskLevel}</p>
                  <Progress value={riskUI.value} className="h-2 mt-2" indicatorClassName={riskUI.progressColor} />
                </div>
              </div>
            </Card>
            <Alert>
              <AlertTitle>Risk Summary</AlertTitle>
              <AlertDescription>{result.riskSummary}</AlertDescription>
            </Alert>
            <Alert variant="default" className="bg-primary/5 border-primary/20">
              <AlertTitle>Recommendations</AlertTitle>
              <AlertDescription>{result.recommendations}</AlertDescription>
            </Alert>
          </div>
        )}
        {!result && !loading && (
          <div className="text-center text-muted-foreground p-8">
            <p>Click the button to generate your personalized risk summary.</p>
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4">Analyzing your data...</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : result ? (
            'Regenerate Summary'
          ) : (
            'Generate Summary'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
