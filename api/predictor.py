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
import { Loader2, BookOpen, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InteractiveVisualization() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('Tell me about Dengue Fever');
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

    return (
      <div className="space-y-4 text-sm">
        <h3 className="text-xl font-bold text-white">{result.diseaseName}</h3>
        
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><Stethoscope size={16} /> Physiology</h4>
            <p className="text-gray-400 pl-6">{result.physiology}</p>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><HeartPulse size={16} /> Pathology</h4>
            <p className="text-gray-400 pl-6">{result.pathology}</p>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><ShieldCheck size={16} /> Preventive Measures</h4>
            <p className="text-gray-400 pl-6">{result.preventive_measures}</p>
        </div>

        <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-blue-500">
            <h4 className="font-semibold text-gray-200 mb-2 flex items-center gap-2"><BookOpen size={16} /> Management Protocol (Govt. of India)</h4>
            <p className="text-gray-400 pl-6">{result.management_protocol_goi}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Disease Information Hub</CardTitle>
        <CardDescription>
          Ask about a disease to get details on its physiology, pathology, and official management protocols.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <Textarea
          placeholder="e.g., Tell me about Influenza"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[60px]"
        />
        {loading && (
          <div className="flex justify-center items-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="ml-3">Fetching information...</p>
          </div>
        )}
        {renderResult()}
      </CardContent>
      <CardFooter>
        <Button onClick={handleQuery} disabled={loading || !query} className="w-full">
          {loading ? 'Fetching...' : 'Get Information'}
        </Button>
      </CardFooter>
    </Card>
  );
}
