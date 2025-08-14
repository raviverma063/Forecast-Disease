
'use client';

import PageHeader from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2, LocateFixed, User as UserIcon } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useAuth } from '@/hooks/use-auth';

const uttarPradeshDistricts = [
    'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Sant Ravidas Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
];

const occupations = [
    'Student', 'Software Engineer', 'Doctor', 'Teacher', 'Farmer', 'Business Owner', 'Government Employee', 'Laborer', 'Homemaker', 'Other'
];

const chronicDiseases = [
    { value: 'none', label: 'None' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'asthma', label: 'Asthma' },
    { value: 'arthritis', label: 'Arthritis' },
    { value: 'heart-disease', label: 'Heart Disease' },
    { value: 'kidney-disease', label: 'Kidney Disease' },
    { value: 'other', label: 'Other' },
];

const allergies = [
    { value: 'none', label: 'None' },
    { value: 'pollen', label: 'Pollen' },
    { value: 'dust-mites', label: 'Dust Mites' },
    { value: 'peanuts', label: 'Peanuts' },
    { value: 'penicillin', label: 'Penicillin' },
    { value: 'latex', label: 'Latex' },
    { value: 'other', label: 'Other' },
];

declare global {
    interface Window {
        google: any;
    }
}

function NotLoggedInView() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Please log in to view and manage your profile.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <UserIcon className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Log in to unlock personalized features and save your data.</p>
            </CardContent>
        </Card>
    )
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };

        geocoder.geocode({ location: latlng }, (results: any, status: any) => {
          if (status === 'OK') {
            if (results[0]) {
              const addressComponents = results[0].address_components;
              const districtComponent = addressComponents.find((c: any) => 
                c.types.includes('administrative_area_level_3') || c.types.includes('administrative_area_level_2')
              );
              
              let foundDistrict = '';
              if (districtComponent) {
                const districtName = districtComponent.long_name.replace(/ District/i, '').trim();
                foundDistrict = uttarPradeshDistricts.find(d => d.toLowerCase() === districtName.toLowerCase()) || '';
              }
              
              if (foundDistrict) {
                setLocation(foundDistrict);
                toast({
                  title: 'Location Found',
                  description: `Set district to: ${foundDistrict}`,
                });
              } else {
                const detectedCity = addressComponents.find((c: any) => c.types.includes('locality'))?.long_name;
                toast({
                  variant: 'destructive',
                  title: 'District Not Found',
                  description: `Your detected location (${detectedCity || 'Unknown'}) could not be matched to a district in Uttar Pradesh. Please select it manually.`,
                });
              }
            } else {
              toast({
                variant: 'destructive',
                title: 'Location Error',
                description: 'No results found for your coordinates.',
              });
            }
          } else {
            toast({
              variant: 'destructive',
              title: 'Geocoder failed',
              description: `Could not determine address due to: ${status}`,
            });
          }
          setIsLocating(false);
        });
      },
      (error) => {
        let description = 'An unknown error occurred while getting your location.';
        switch(error.code) {
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
          description,
        });
        setIsLocating(false);
      }
    );
  };

  if (!isClient || loading) {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p>Loading Profile...</p>
        </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <PageHeader title="User Profile" />
        <div className="grid w-full max-w-2xl gap-6 mx-auto">
          {!user ? <NotLoggedInView /> : (
            <>
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
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                      <AvatarFallback>{user.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1.5">
                      <h3 className="text-lg font-semibold">{user.displayName}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user.displayName ?? ''} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user.email ?? ''} disabled />
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
                        <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger id="location">
                                <SelectValue placeholder="Select your district" />
                            </SelectTrigger>
                            <SelectContent>
                                {uttarPradeshDistricts.map(district => (
                                    <SelectItem key={district} value={district}>{district}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={handleUseCurrentLocation}
                            disabled={isLocating}
                        >
                            {isLocating ? <Loader2 className="animate-spin" /> : <LocateFixed />}
                            <span className="sr-only">Use Current Location</span>
                        </Button>
                      </div>
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
                      <Label>Current or Chronic Diseases</Label>
                      <MultiSelect
                        options={chronicDiseases}
                        selected={selectedDiseases}
                        onChange={setSelectedDiseases}
                        placeholder="Select diseases..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Known Allergies</Label>
                      <MultiSelect
                        options={allergies}
                        selected={selectedAllergies}
                        onChange={setSelectedAllergies}
                        placeholder="Select allergies..."
                      />
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
