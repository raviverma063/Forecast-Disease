'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Hospital, MapPin, Loader2, BookOpen, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react';

//================================================================//
//  1. Interactive Visualization Component (Disease Info Hub)     //
//================================================================//
function InteractiveVisualization() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('Tell me about Dengue Fever');
  const [result, setResult] = useState(null);

  // Effect to load saved data from localStorage on initial render
  useEffect(() => {
    const savedQuery = localStorage.getItem('interactiveQuery');
    const savedResult = localStorage.getItem('interactiveResult');
    if (savedQuery) {
        try {
            setQuery(JSON.parse(savedQuery));
        } catch (e) {
            console.error("Failed to parse saved query:", e);
        }
    }
    if (savedResult) {
        try {
            setResult(JSON.parse(savedResult));
        } catch (e) {
            console.error("Failed to parse saved result:", e);
        }
    }
  }, []);

  // Effect to save data to localStorage whenever query or result changes
  useEffect(() => {
    try {
        localStorage.setItem('interactiveQuery', JSON.stringify(query));
        if (result) {
          localStorage.setItem('interactiveResult', JSON.stringify(result));
        }
    } catch (e) {
        console.error("Failed to save to localStorage:", e);
    }
  }, [query, result]);

  const handleQuery = async () => {
    if (!query) return;
    setLoading(true);
    setResult(null);
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const profileData = savedProfile ? JSON.parse(savedProfile) : {};

      // API call to your backend predictor
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="space-y-4 text-sm mt-4">
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


//================================================================//
//  2. Mock Chart Component (Placeholder)                         //
//================================================================//
const MockLineChart = () => (
    <div className="w-full h-64 bg-gray-800 p-4 rounded-lg">
         <img src="https://placehold.co/800x400/1f2937/ffffff?text=Local+Disease+Trends+Chart" alt="Placeholder chart for local disease trends" className="w-full h-full object-cover rounded-md"/>
    </div>
);


//================================================================//
//  3. Main Dashboard Page Component                              //
//================================================================//
export default function DashboardPage() {
  const [locationError, setLocationError] = useState("Could not find location. Please set your district in your profile.");

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {/* Alerts Section */}
      <div className="flex flex-col gap-2">
          <div className="bg-red-900/50 border border-red-500 text-white p-3 rounded-lg flex items-center gap-3">
              <span className="font-bold bg-red-600 px-2 py-1 rounded-md text-sm">Immediate</span>
              <span>Dengue Fever Spike</span>
              <span className="ml-auto text-sm text-gray-300">Apply mosquito repellent (DEET 20%) morning + evening.</span>
          </div>
          <div className="bg-orange-900/50 border border-orange-500 text-white p-3 rounded-lg flex items-center gap-3">
              <span className="font-bold bg-orange-500 px-2 py-1 rounded-md text-sm">High</span>
              <span>Seasonal Influenza Surge</span>
              <span className="ml-auto text-sm text-gray-300">Wear mask in crowded indoor areas.</span>
          </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Local Disease Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <MockLineChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Hospital className="h-6 w-6 text-primary" />
                  <CardTitle>Nearby Hospital Locator</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                  <Button asChild size="lg" className="w-full md:w-1/2">
                      <Link href="/community">
                          <MapPin className="mr-2 h-5 w-5" /> View Nearby Facilities
                      </Link>
                  </Button>
                  {locationError && (
                      <p className="text-red-500 text-sm mt-2">{locationError}</p>
                  )}
              </CardContent>
            </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1">
          <InteractiveVisualization />
        </div>
      </div>
    </div>
  );
}
