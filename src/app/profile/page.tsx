
'use client';

import PageHeader from '@/components/page-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [date, setDate] = useState<Date>();
  const [isClient, setIsClient] = useState(false);
  const [location, setLocation] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd use a reverse geocoding service
          // to get the address from coordinates.
          // For this example, we'll just use the coordinates.
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          toast({
            title: 'Location Found',
            description: 'Your current location has been filled in.',
          });
        },
        (error) => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not retrieve your location. Please enter it manually.',
          });
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="User Profile" />
      <div className="grid gap-6 max-w-2xl mx-auto w-full">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Manage your personal and preference settings to get better predictions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="person avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="grid gap-1.5">
                <h3 className="text-lg font-semibold">Alex Doe</h3>
                <p className="text-sm text-muted-foreground">alex.doe@example.com</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Alex Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="alex.doe@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                     {isClient && <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        initialFocus
                      />}
                    </PopoverContent>
                  </Popover>
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
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <Input id="location" placeholder="e.g., New York, NY" value={location} onChange={(e) => setLocation(e.target.value)} />
                  <Button variant="outline" size="icon" onClick={handleUseCurrentLocation}>
                    <MapPin className="h-4 w-4" />
                    <span className="sr-only">Use current location</span>
                  </Button>
                </div>
              </div>

               <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" placeholder="e.g., Software Engineer" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diseases">Current or Chronic Diseases</Label>
                <Textarea id="diseases" placeholder="e.g., Asthma, Diabetes" />
              </div>

               <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea id="allergies" placeholder="e.g., Peanuts, Pollen" />
              </div>

            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prediction History</CardTitle>
            <CardDescription>A log of your past generated predictions and insights.</CardDescription>
          </Header>
          <CardContent>
            <div className="text-center text-muted-foreground p-8 border-dashed border-2 rounded-lg">
                <p>Your prediction history is empty.</p>
                <p className="text-sm">Generated insights will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
