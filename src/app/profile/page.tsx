
'use client';

import PageHeader from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MapPin } from 'lucide-react';
import { useState } from 'react';

const upDistricts = [
  'Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich',
  'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr',
  'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad',
  'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras',
  'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri',
  'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur',
  'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal',
  'Sant Kabir Nagar', 'Sant Ravidas Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur',
  'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
];

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
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const { toast } = useToast();

  const handleUseCurrentLocation = async () => {
    setIsFetchingLocation(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch location from IP.');
      }
      const data = await response.json();
      
      if (data.country_name === 'India' && data.region === 'Uttar Pradesh') {
        const district = data.city;
        const matchedDistrict = upDistricts.find(d => d.toLowerCase() === district.toLowerCase());

        if (matchedDistrict) {
          setLocation(matchedDistrict);
          toast({
            title: 'Location Set',
            description: `Your district has been set to ${matchedDistrict}.`,
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'District Not Found',
            description: `We couldn't match your city "${district}" to a district in Uttar Pradesh. Please select it manually.`,
          });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Location Outside Uttar Pradesh',
          description: 'This feature is available only for users in Uttar Pradesh, India.',
        });
      }
    } catch (error) {
      console.error('IP Geolocation error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Fetching Location',
        description: 'Could not get your location from your IP address. Please select it manually.',
      });
    } finally {
      setIsFetchingLocation(false);
    }
  };

  return (
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
                <div className="flex gap-2">
                    <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger id="location">
                            <SelectValue placeholder="Select your district" />
                        </SelectTrigger>
                        <SelectContent>
                            {upDistricts.map(district => (
                                <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={handleUseCurrentLocation} aria-label="Use current location" disabled={isFetchingLocation}>
                        <MapPin className="w-4 h-4" />
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
  );
}
