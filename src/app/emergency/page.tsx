'use client'; // Required because this page now uses an interactive client component

import PageHeader from '../../components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Ambulance, Hospital, Phone } from 'lucide-react';
import { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// --- Data and Components for the First Aid Section ---

// THIS IS THE NEW, EXPANDED LIST OF 20 EMERGENCIES
const emergencies = [
  {
    id: "heartattack",
    name: "Heart Attack (Myocardial Infarction)",
    steps: [
      "Signs: Crushing pain in center of chest, sweating, shortness of breath, nausea.",
      "Help the person sit down comfortably, leaning against a wall.",
      "Call 112 immediately.",
      "Loosen tight clothing.",
      "Ask if they have prescribed medication (like Sorbitrate) and help them take it.",
      "If conscious and not allergic, give one Aspirin (325 mg) to chew slowly.",
      "Be ready for CPR if they become unresponsive."
    ],
    govt: "ICMR/AIIMS: Early hospital transfer and immediate ECG monitoring recommended.",
  },
  {
    id: "cardiacarrest",
    name: "Cardiac Arrest (No Breathing)",
    steps: [
        "Signs: Suddenly collapses, unresponsive, not breathing normally.",
        "Call for help (112) and shout for an AED if available.",
        "Start Chest Compressions (Hands-Only CPR): Place heel of one hand on the center of the chest, other hand on top.",
        "Push hard and fast (100-120 compressions per minute).",
        "Don't stop until help arrives or the person starts to move."
    ],
    govt: "Govt Protocol: Immediate CPR can double or triple chances of survival. Continue until medical professionals take over.",
  },
  {
    id: "bleeding",
    name: "Severe Bleeding (Hemorrhage)",
    steps: [
      "Signs: Visible wound with profuse blood flow.",
      "Wear gloves if available. Have the person lie down.",
      "Apply direct, firm pressure on the wound with a sterile gauze or clean cloth.",
      "If bleeding soaks through, add another layer on top. Do NOT remove the original cloth.",
      "If a limb is injured, elevate it above the heart (unless a fracture is suspected)."
    ],
    govt: "Govt Protocol: Do not use a tourniquet unless bleeding is life-threatening and cannot be controlled by direct pressure.",
  },
  {
    id: "burns",
    name: "Burns",
    steps: [
      "Cool the burn immediately under cool (not ice-cold) running water for at least 10-20 minutes.",
      "Gently remove rings or watches before the area swells.",
      "Cover the burn loosely with a sterile, non-stick dressing.",
      "Do NOT apply ice, butter, toothpaste, or any ointments.",
      "Do NOT break blisters."
    ],
    govt: "NDMA: For major burns, cover with a clean sheet and seek immediate hospital care. Do not immerse in water.",
  },
  {
    id: "fracture",
    name: "Fractures (Broken Bone)",
    steps: [
        "Signs: Severe pain, swelling, deformity, inability to move.",
        "Tell the person not to move the injured part. Call 112.",
        "Support the injured area to immobilize it.",
        "Create a makeshift splint with cardboard or a stick, tied with a cloth.",
        "Do NOT try to realign the bone."
    ],
    govt: "MoHFW: Immobilization is key to prevent further injury during transport.",
  },
  {
    id: "snakebite",
    name: "Snake Bite",
    steps: [
        "Keep the person calm and still to slow venom spread.",
        "Call 112 immediately. Remember the snake's appearance if possible.",
        "Have the person lie down with the bite area below heart level.",
        "Remove tight clothing or jewelry near the bite.",
        "Do NOT cut the wound, suck venom, apply a tourniquet, or apply ice."
    ],
    govt: "MoHFW: Immediate transfer to a hospital with Anti-Snake Venom (ASV) is the only effective treatment.",
  },
   {
    id: "dogbite",
    name: "Dog/Animal Bite",
    steps: [
        "Wash the wound thoroughly with soap and running water for at least 15 minutes.",
        "Apply a clean dressing to stop minor bleeding.",
        "Go to a hospital immediately for Tetanus and Rabies vaccination.",
        "If possible, safely observe the animal for signs of rabies."
    ],
    govt: "Govt Protocol: Post-exposure prophylaxis (PEP) for rabies is mandatory and life-saving.",
  },
  {
    id: "choking",
    name: "Choking",
    steps: [
        "Signs: Clutching throat, unable to talk or cough, turning blue.",
        "Perform the Heimlich Maneuver: Stand behind the person, wrap arms around their waist.",
        "Make a fist and place it just above their navel.",
        "Grasp your fist with your other hand and perform quick, upward thrusts.",
        "Continue until the object is dislodged or help arrives."
    ],
    govt: "Govt Protocol: Encourage coughing first. If ineffective, proceed with abdominal thrusts.",
  },
  {
    id: "fainting",
    name: "Fainting (Syncope)",
    steps: [
        "Lay the person down on their back.",
        "Elevate their legs 8-12 inches to restore blood flow to the brain.",
        "Loosen tight clothing. Ensure fresh air.",
        "Wipe their face with a wet cloth. Do not splash water.",
        "Once conscious, do not let them get up too quickly."
    ],
    govt: "Govt Protocol: If fainting is recurrent or accompanied by other symptoms, a full medical evaluation is necessary.",
  },
   {
    id: "heatstroke",
    name: "Heat Stroke",
    steps: [
        "Signs: High body temp, red/hot/dry skin, confusion, unconsciousness.",
        "Call 112 – this is a critical emergency.",
        "Move the person to a cool, shaded place.",
        "Cool the person rapidly: spray with cool water or place wet cloths on neck, armpits, and groin.",
        "Do not give fluids if the person is confused or unconscious."
    ],
    govt: "NDMA: Rapid cooling is the most critical intervention to prevent organ damage.",
  },
   {
    id: "stroke",
    name: "Stroke (Brain Attack)",
    steps: [
        "Remember F.A.S.T: Face drooping, Arm weakness, Speech difficulty, Time to call 112.",
        "Call 112 immediately. Note the time symptoms began.",
        "Lay the person on their side with their head slightly raised.",
        "Do not give them anything to eat or drink."
    ],
    govt: "MoHFW: 'Golden Hour' is critical; thrombolysis within 4.5 hours of an ischemic stroke can be life-saving.",
  },
  {
    id: "seizure",
    name: "Seizures (Fits/Epilepsy)",
    steps: [
        "Ease the person to the floor and clear the area of sharp objects.",
        "Place something soft and flat under their head.",
        "Turn the person gently onto one side to help them breathe.",
        "Do NOT put anything in their mouth or try to hold them down.",
        "Time the seizure and stay with them until they are fully aware."
    ],
    govt: "Govt Protocol: Most seizures are not emergencies unless they last >5 mins or the person is injured.",
  },
  {
    id: "drowning",
    name: "Drowning",
    steps: [
        "Call 112. Only attempt a water rescue if you are trained.",
        "Once on land, check for responsiveness and breathing.",
        "If not breathing, begin CPR immediately (30 chest compressions, then 2 rescue breaths if trained).",
        "Continue CPR until help arrives."
    ],
    govt: "Govt Protocol: All drowning victims should be taken to hospital, even if they seem fine, due to risk of secondary drowning.",
  },
  {
    id: "electricshock",
    name: "Electric Shock",
    steps: [
        "Do NOT touch the person if they are still in contact with the electrical source.",
        "Turn off the power source. If not possible, use a dry, non-conductive object (like a wooden stick) to move the source away.",
        "Call 112. Once safe, check for breathing and begin CPR if needed.",
        "Treat any burns."
    ],
    govt: "Govt Protocol: Electrical injuries can cause severe internal damage not visible on the skin. Hospital evaluation is mandatory.",
  },
  {
    id: "poisoning",
    name: "Poisoning",
    steps: [
        "Call 112 or a Poison Control Center immediately.",
        "Have the poison container with you to provide information.",
        "Do NOT induce vomiting unless specifically instructed to do so by a medical professional."
    ],
    govt: "AIIMS/NPIC: Management is specific to the poison. Never attempt home remedies.",
  },
  {
    id: "anaphylaxis",
    name: "Severe Allergic Reaction (Anaphylaxis)",
    steps: [
        "Signs: Difficulty breathing, swelling of face/tongue, hives, dizziness.",
        "Call 112 immediately.",
        "Check if the person has an epinephrine auto-injector (EpiPen). Help them use it.",
        "Lay the person down and elevate their legs. Loosen tight clothing.",
        "If they stop breathing, begin CPR."
    ],
    govt: "MoHFW: Epinephrine is the first-line, life-saving treatment.",
  },
  {
    id: "headinjury",
    name: "Head Injury",
    steps: [
        "Call 112 if the person is unconscious, confused, vomiting, or has a seizure.",
        "Keep the person's head and neck still. Do not move them.",
        "Apply a cold pack to any swollen area.",
        "Monitor their breathing and consciousness until help arrives."
    ],
    govt: "Govt Protocol: Any significant head injury requires medical evaluation to rule out internal bleeding.",
  },
  {
    id: "nosebleed",
    name: "Nosebleed (Epistaxis)",
    steps: [
        "Have the person sit down and lean forward slightly.",
        "Pinch the soft part of the nose firmly for 10-15 minutes.",
        "Breathe through the mouth.",
        "Apply a cold compress to the bridge of the nose.",
        "Do NOT tilt the head backward."
    ],
    govt: "Govt Protocol: If bleeding is severe or doesn't stop after 20 minutes of pressure, seek medical help.",
  },
  {
    id: "sprain",
    name: "Sprains and Strains",
    steps: [
        "Follow R.I.C.E: Rest, Ice, Compression, Elevation.",
        "Rest the injured joint.",
        "Apply an ice pack wrapped in a cloth for 15-20 minutes every 2-3 hours.",
        "Wrap with an elastic bandage to reduce swelling.",
        "Elevate the injured limb above heart level."
    ],
    govt: "Govt Protocol: If you cannot bear weight on the joint or there is a popping sound, see a doctor to rule out a fracture.",
  },
  {
    id: "hypothermia",
    name: "Hypothermia (Low Body Temperature)",
    steps: [
        "Signs: Shivering, slurred speech, drowsiness, confusion.",
        "Move the person to a warm place. Remove wet clothing and dry them.",
        "Warm the person gradually with blankets and layers of dry clothing.",
        "Offer warm, non-alcoholic, non-caffeinated drinks if conscious.",
        "Do NOT apply direct heat like a heating pad."
    ],
    govt: "NDMA: Gradual rewarming is critical. Rapid rewarming can cause dangerous heart rhythms.",
  },
];

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

function EmergencyDragDrop() {
  const [selected, setSelected] = useState(null);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <HelpBox onDrop={setSelected} selected={selected} />
      </div>
    </DndProvider>
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
    (
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
      </div>

      {/* --- This is the new, interactive First Aid section --- */}
      <div className="mt-6">
        <EmergencyDragDrop />
      </div>

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
    )
  );
}

