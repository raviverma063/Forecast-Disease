'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PageHeader from '@/components/page-header';
import { getPreventativeMeasures } from '@/app/actions';
import { type PreventativeMeasuresOutput } from '@/ai/flows/preventative-measures';
import { Loader2, ShieldQuestion } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MOCK_INPUT = {
  liveLocation: 'Urban area with high population density',
  diseaseRiskFactors: 'High risk for airborne viruses and vector-borne illnesses due to season.',
};

export default function PreventionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PreventativeMeasuresOutput | null>(null);
  const { toast } = useToast();

  const handleFetchMeasures = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await getPreventativeMeasures(MOCK_INPUT);
      setResult(res);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate preventative measures.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Preventative Measures" />
      <div className="max-w-2xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Prevention Advice</CardTitle>
            <CardDescription>
              Get personalized health recommendations based on your live location and disease risk factors.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <p><span className="font-semibold">Your Location Context:</span> {MOCK_INPUT.liveLocation}</p>
                <p><span className="font-semibold">Identified Risk Factors:</span> {MOCK_INPUT.diseaseRiskFactors}</p>
            </div>
            
            <Button onClick={handleFetchMeasures} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Advice...
                </>
              ) : (
                'Get My Preventative Measures'
              )}
            </Button>
            
            {loading && (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            
            {result ? (
              <Alert variant="default" className="bg-primary/5 border-primary/20">
                <ShieldQuestion className="h-4 w-4" />
                <AlertTitle>Your Personalized Measures</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">
                  {result.preventativeMeasures}
                </AlertDescription>
              </Alert>
            ) : !loading && (
                <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                    <p>Your prevention advice will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
