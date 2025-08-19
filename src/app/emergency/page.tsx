'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageHeader from '../../components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Ambulance, Hospital, Phone, ShieldQuestion } from 'lucide-react';

// --- Data for the First Aid Section ---
const emergencies = [
  {
    id: "cuts",
    name: "Cuts & Scrapes",
    steps: [
      "Wash hands thoroughly with soap and water.",
      "Clean wound with cool water and mild soap.",
      "Apply gentle pressure with clean cloth to stop bleeding.",
      "Apply an antibiotic ointment.",
      "Cover with a sterile bandage or dressing."
    ],
    govt: "MoHFW: Seek medical attention if wound is deep, contaminated, or uncontrolled bleeding.",
  },
  {
    id: "burns",
    name: "Burns",
    steps: [
      "Cool the burn under running water for 10–20 minutes.",
      "Do not apply ice, toothpaste, or oils.",
      "Cover loosely with sterile non-fluffy cloth.",
      "Give fluids if patient is conscious.",
    ],
    govt: "NDMA: For burns >10% body surface or involving face/genitals, rush to hospital immediately.",
  },
  {
    id: "fracture",
    name: "Fracture / Sprain",
    steps: [
      "Immobilize the injured part.",
      "Do not attempt to realign bone.",
      "Apply cold compress to reduce swelling.",
      "Keep patient still until help arrives."
    ],
    govt: "MoHFW: Transport with splint support. Avoid unnecessary movement.",
  },
  {
    id: "snake",
    name: "Snake Bite",
    steps: [
      "Keep the patient calm and still.",
      "Immobilize the bitten limb with a splint.",
      "Do NOT cut, suck, or apply tight tourniquets.",
      "Shift immediately to hospital with ASV availability."
    ],
    govt: "MoHFW: Use pressure immobilization only in specific cases (per protocol). Always seek immediate hospital care.",
  },
  {
    id: "heartattack",
    name: "Heart Attack",
    steps: [
      "Call emergency services immediately (112 in India).",
      "Keep patient calm and in a comfortable sitting position.",
      "If available, give one aspirin to chew (unless allergic).",
      "Monitor breathing and pulse; be ready for CPR if patient collapses."
    ],
    govt: "ICMR/AIIMS: Early hospital transfer and immediate ECG monitoring recommended.",
  },
  {
    id: "stroke",
    name: "Stroke",
    steps: [
      "Call emergency services immediately (112).",
      "Note the time of symptom onset.",
      "Do not give anything orally.",
      "Keep patient in a safe, comfortable position with head slightly elevated."
    ],
    govt: "MoHFW: 'Golden Hour' is critical; thrombolysis within 4.5 hours if ischemic stroke.",
  },
];

// --- New Component using a Dropdown Menu ---
function EmergencySelector() {
  const [selectedId, setSelectedId] = useState('');
  const selectedEmergency = emergencies.find(e => e.id === selectedId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <ShieldQuestion className="h-8 w-8 text-yellow-400" />
            <CardTitle>First Aid Instructions</CardTitle>
        </div>
        <CardDescription>Select an emergency to see the recommended first aid steps.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedId} value={selectedId}>
          <SelectTrigger>
            <SelectValue placeholder="Select an emergency..." />
          </SelectTrigger>
          <SelectContent>
            {emergencies.map(emergency => (
              <SelectItem key={emergency.id} value={emergency.id}>
                {emergency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedEmergency && (
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-xl font-bold mb-3 text-white">{selectedEmergency.name}</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-300">
              {selectedEmergency.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            <p className="mt-4 text-red-400 font-semibold text-xs">
                <strong>Govt Protocol:</strong> {selectedEmergency.govt}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


// --- Main Emergency Page Component ---
const emergencyContacts = [
  { name: 'National Emergency Number', number: '112' },
  { name: 'Police', number: '100' },
  { name: 'Fire', number: '101' },
];

export default function EmergencyPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader title="My Emergency" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Call Ambulance Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Ambulance className="h-8 w-8 text-destructive" />
              <CardTitle>Call Ambulance</CardTitle>
            </div>
            <CardDescription>
              Immediately connect to the national emergency number for medical assistance.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            <Button asChild size="lg" variant="destructive" className="w-full md:w-auto">
              <a href="tel:112">
                <Phone className="mr-2 h-5 w-5" /> Call 112 Now
              </a>
            </Button>
          </CardContent>
        </Card>
        
        {/* Nearby Hospitals Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <Hospital className="h-8 w-8 text-primary" />
                <CardTitle>Nearby Hospitals (24/7)</CardTitle>
            </div>
            <CardDescription>
              Find the nearest 24/7 medical facilities in your community.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Button asChild size="lg" className="w-full md:w-auto">
                <Link href="/community">
                    <Hospital className="mr-2 h-5 w-5" /> View Community Hub
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* --- This is the new, interactive First Aid section --- */}
      <div className="mt-6">
        <EmergencySelector />
      </div>

      {/* Other Emergency Contacts Card */}
      <Card className="mt-6">
          <CardHeader>
              <CardTitle>Other Emergency Contacts</CardTitle>
              <CardDescription>Quick access to other important numbers.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {emergencyContacts.map(contact => (
                      <Button asChild key={contact.name} variant="outline" size="lg">
                          <a href={`tel:${contact.number}`}>
                              <Phone className="mr-2 h-4 w-4" /> {contact.name} ({contact.number})
                          </a>
                      </Button>
                  ))}
              </div>
          </CardContent>
      </Card>
    </div>
  );
}
