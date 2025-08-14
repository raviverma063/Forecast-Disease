'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRiskFactorSummary } from '@/app/actions';
import { type RiskFactorSummaryOutput } from '@/ai/flows/risk-factor-summary';
import { Loader2, Siren } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '../ui/alert';

const MOCK_INPUT = {
  profileData:
    'Healthy 30-year-old, works in a metal factory, chews paan.',
  location: 'New Delhi, India',
  weatherData: '35°C, humid, post-monsoon season.',
  localHealthData: 'Recent increase in dengue cases reported.',
  governmentHealthData:
    'IDSP reports active vector-borne disease transmission in the region. Groundwater tests show high nitrate levels.',
  environmentRiskData:
    'High air pollution (AQI 150), stagnant water observed in some areas. High copper dust in industrial zones.',
};

const RiskItem = ({ risk }: { risk: RiskFactorSummaryOutput['risks'][0] }) => (
  <Alert className="flex items-center justify-between p-3">
    <div>
      <p className="font-semibold text-sm">
        <span className="text-muted-foreground">{risk.category}:</span> {risk.name}{' '}
        <span className="font-normal text-muted-foreground">({risk.value})</span>
      </p>
    </div>
    <AlertDescription className='text-right'>
      <span className="font-medium text-primary">{risk.recommendation}</span>
    </AlertDescription>
  </Alert>
);

export default function RiskSummary() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<RiskFactorSummaryOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleAnalysis = async () => {
      setLoading(true);
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
    handleAnalysis();
  }, [toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Siren className="h-6 w-6 text-destructive" />
          Live Risk Radar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex justify-center items-center p-8 min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {!loading && result && (
          <div className="space-y-3">
            {result.risks.map((risk, index) => (
              <RiskItem key={index} risk={risk} />
            ))}
          </div>
        )}
        {!loading && !result && (
            <div className="text-center text-muted-foreground p-8 min-h-[200px] flex items-center justify-center">
                <p>Could not load risk data.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
