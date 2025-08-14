'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/page-header';
import { type Facility } from '@/lib/types';
import { MapPin, Building, Stethoscope } from 'lucide-react';

const facilities: Facility[] = [
  {
    name: 'City General Hospital',
    type: 'Government',
    distance: '2.5 km',
    speciality: 'Multi-speciality',
    location: '123 Main St, Cityville',
  },
  {
    name: 'Wellness Clinic',
    type: 'Private',
    distance: '1.8 km',
    speciality: 'General Physician',
    location: '456 Oak Ave, Townburg',
  },
  {
    name: 'Hope Health Initiative',
    type: 'NGO',
    distance: '5.1 km',
    speciality: 'Community Health',
    location: '789 Pine Ln, Villagetown',
  },
  {
    name: 'Regional Medical Center',
    type: 'Government',
    distance: '8.0 km',
    speciality: 'Trauma & Emergency',
    location: '101 River Rd, Metrocity',
  },
  {
    name: 'CareFirst Medical',
    type: 'Private',
    distance: '3.2 km',
    speciality: 'Cardiology',
    location: '212 Birch Blvd, Suburbia',
  },
];

const FacilityCard = ({ facility }: { facility: Facility }) => (
  <Card>
    <CardHeader>
      <CardTitle>{facility.name}</CardTitle>
      <CardDescription className="flex items-center gap-2 pt-1">
        <Building className="h-4 w-4" /> {facility.type}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 text-primary" />
        <span>{facility.distance} away</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Stethoscope className="h-4 w-4 text-primary" />
        <span>{facility.speciality}</span>
      </div>
    </CardContent>
    <CardFooter>
      <Button asChild className="w-full">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            facility.location
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin className="mr-2 h-4 w-4" /> Get Directions
        </a>
      </Button>
    </CardFooter>
  </Card>
);

const FacilityList = ({ filter }: { filter: string }) => {
  const filteredFacilities =
    filter === 'all'
      ? facilities
      : facilities.filter((f) => f.type.toLowerCase() === filter);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredFacilities.map((facility) => (
        <FacilityCard key={facility.name} facility={facility} />
      ))}
    </div>
  );
};

export default function CommunityPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="Community Health Hub" />
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid w-full grid-cols-4 max-w-lg mx-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
          <TabsTrigger value="private">Private</TabsTrigger>
          <TabsTrigger value="ngo">NGO</TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="all">
            <FacilityList filter="all" />
          </TabsContent>
          <TabsContent value="government">
            <FacilityList filter="government" />
          </TabsContent>
          <TabsContent value="private">
            <FacilityList filter="private" />
          </TabsContent>
          <TabsContent value="ngo">
            <FacilityList filter="ngo" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
