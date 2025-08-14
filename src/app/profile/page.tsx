
'use client';

import PageHeader from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import Script from 'next/script';
import { Loader2, LocateFixed } from 'lucide-react';

const occupations = [
    'Student', 'Software Engineer', 'Doctor', 'Teacher', 'Farmer', 'Business Owner', 'Government Employee', 'Laborer', 'Homemaker', 'Other'
];

const chronicDiseases = [
    'None', 'Diabetes', 'Hypertension', 'Asthma', 'Arthritis', 'Heart Disease', 'Kidney Disease', 'Other'
];

const allergies = [
    'None', 'Pollen', 'Dust Mites', 'Peanuts', 'Penicillin', 'Latex', 'Other'
];

export default function ProfilePage() {
  const [location, setLocation] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  }

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Error',
        description: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    if (!isScriptLoaded || !window.google) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Location services are not ready yet. Please try again in a moment.',
      });
      return;
    }
    
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geocoder = new window.google.maps.Geocoder();
        const latlng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        geocoder.geocode({ location: latlng }, (results, status) => {
          setIsLocating(false);
          if (status === 'OK') {
            if (results && results[0]) {
              setLocation(results[0].formatted_address);
              toast({
                title: 'Location Found',
                description: `Set location to: ${results[0].formatted_address}`,
              });
            } else {
              toast({
                variant: 'destructive',
                title: 'Geolocation Error',
                description: 'No results found for your location.',
              });
            }
          } else {
            toast({
              variant: 'destructive',
              title: 'Geolocation Error',
              description: `Geocoder failed due to: ${status}`,
            });
          }
        });
      },
      (error) => {
        setIsLocating(false);
        let description = 'An unknown error occurred.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            description = 'You denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            description = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            description = 'The request to get user location timed out.';
            break;
        }
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: description,
        });
        console.error('Geolocation error:', error);
      }
    );
  };


  return (
    <>
    <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geocoding`}
        onLoad={handleScriptLoad}
        async
        defer
      />
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="User Profile" />
      <div className="grid w-full max-w-2xl gap-6 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal and preference settings to get better predictions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="person avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5">
                <h3 className="text-lg font-semibold">Alex Doe</h3>
                <p className="text-sm text-muted-foreground">alex.doe@example.com</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Alex Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="alex.doe@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" placeholder="YYYY-MM-DD" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sex">Sex</Label>
                  <Select>
                    <SelectTrigger id="sex">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (District)</Label>
                <div className="flex items-center gap-2">
                    <Input 
                        id="location" 
                        placeholder="Your location" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button 
                        type="button" 
                        variant="outline"
                        onClick={handleUseCurrentLocation}
                        disabled={!isScriptLoaded || isLocating}
                    >
                        {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
                        <span className="sr-only">Use Current Location</span>
                    </Button>
                </div>
                {!isScriptLoaded && <p className="text-sm text-muted-foreground">Loading location services...</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Select>
                    <SelectTrigger id="occupation">
                        <SelectValue placeholder="Select your occupation" />
                    </SelectTrigger>
                    <SelectContent>
                        {occupations.map(occ => (
                            <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="diseases">Current or Chronic Diseases</Label>
                <Select>
                    <SelectTrigger id="diseases">
                        <SelectValue placeholder="Select a disease if applicable" />
                    </SelectTrigger>
                    <SelectContent>
                        {chronicDiseases.map(disease => (
                            <SelectItem key={disease} value={disease}>{disease}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Select>
                    <SelectTrigger id="allergies">
                        <SelectValue placeholder="Select an allergy if applicable" />
                    </SelectTrigger>
                    <SelectContent>
                        {allergies.map(allergy => (
                            <SelectItem key={allergy} value={allergy}>{allergy}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction History</CardTitle>
            <CardDescription>A log of your past generated predictions and insights.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
              <p>Your prediction history is empty.</p>
              <p className="text-sm">Generated insights will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}
