import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ambulance, Hospital, Phone, PlusSquare } from 'lucide-react';

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
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
                <Hospital className="h-8 w-8 text-primary" />
                <CardTitle>Nearby Hospitals (24/7)</CardTitle>
            </div>
            <CardDescription>
              Find the nearest 24/7 medical facilities.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Button asChild size="lg" className="w-full md:w-auto">
                <a href="https://www.google.com/maps/search/hospital+near+me" target="_blank" rel="noopener noreferrer">
                    <Hospital className="mr-2 h-5 w-5" /> Find Hospitals
                </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
                <PlusSquare className="h-8 w-8 text-green-500" />
                <CardTitle>First Aid & Band Care</CardTitle>
            </div>
            <CardDescription>
              Basic instructions for common minor injuries.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
             import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Emergency Data
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
    name: "Heart Attack (Myocardial Infarction)",
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
  {
    id: "anaphylaxis",
    name: "Severe Allergy / Anaphylaxis",
    steps: [
      "Call emergency services immediately.",
      "If patient has auto-injector (EpiPen), administer immediately.",
      "Lay patient flat with legs raised unless breathing is difficult.",
      "Loosen tight clothing and keep airway clear."
    ],
    govt: "MoHFW: Epinephrine IM is first-line; repeat every 5–15 minutes as needed while shifting to hospital.",
  },
  {
    id: "poisoning",
    name: "Poisoning / Ingestion of Toxic Substance",
    steps: [
      "Call poison helpline or emergency services immediately.",
      "Do NOT induce vomiting unless advised by a doctor.",
      "Keep patient calm and breathing pathway clear.",
      "Provide information on substance ingested to healthcare providers."
    ],
    govt: "AIIMS/NPIC: Gastric lavage only under medical supervision; activated charcoal in specific cases.",
  }
];

// Draggable Item Component
function EmergencyItem({ emergency }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "EMERGENCY",
    item: emergency,
    collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
  }));

  return (
    <div
      ref={drag}
      className={`p-3 m-2 rounded-xl cursor-move shadow-md bg-gray-800 text-white hover:bg-gray-700 transition ${isDragging ? "opacity-50" : ""}`}
    >
      {emergency.name}
    </div>
  );
}

// Drop Zone
function HelpBox({ onDrop, selected }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "EMERGENCY",
    drop: (item) => onDrop(item),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  return (
    <Card ref={drop} className={`p-4 min-h-[200px] border-2 ${isOver ? "border-blue-500" : "border-gray-600"}`}>
      <CardHeader>
        <CardTitle>🆘 Drag Emergency Here</CardTitle>
      </CardHeader>
      <CardContent>
        {selected ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              {selected.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            <p className="mt-3 text-red-400 font-semibold">Govt Protocol: {selected.govt}</p>
          </div>
        ) : (
          <p className="text-gray-400">Drop an emergency to see first aid steps.</p>
        )}
      </CardContent>
    </Card>
  );
}

// Main Component
export default function EmergencyDragDrop() {
  const [selected, setSelected] = useState(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Emergency List */}
        <Card className="p-4 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">🚨 Select Emergency</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap">
            {emergencies.map((e) => (
              <EmergencyItem key={e.id} emergency={e} />
            ))}
          </CardContent>
        </Card>

        {/* Drop Zone */}
        <HelpBox onDrop={setSelected} selected={selected} />
      </div>
    </DndProvider>
  );
}

          </CardContent>
        </Card>

        <Card className="md:col-span-2">
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
    </div>
  );
}
