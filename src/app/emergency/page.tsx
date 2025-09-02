'use client';

import React, { useState } from 'react';

// --- SVG Icons (replaces lucide-react) ---
const AmbulanceIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M9 18a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1z"/><path d="M8 8v4"/><path d="m19 12 1.5-4.5L22 12"/><path d="M15 12h-3c-1 0-3 1-3 3v2"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
    </svg>
);
const HospitalIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 6v4"/><path d="M14 8h-4"/><path d="M14 16h-4"/><path d="M12 14v4"/><path d="M20 10c0-1.1-.9-2-2-2h-1V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3.3"/><path d="M18 12.3v-1.6c0-.5-.4-.9-.9-.9h-1.2c-.5 0-.9.4-.9.9V12"/>
    </svg>
);
const PhoneIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);

// --- UI Component Recreations (replaces shadcn/ui components) ---
// Note: In a real project, these would likely come from a UI library like shadcn/ui.
const PageHeader = ({ title }) => (
    <div className="flex items-center justify-between pb-4 border-b border-gray-700">
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
    </div>
);
const Card = ({ children, className }) => <div className={`bg-gray-800 border border-gray-700 rounded-xl shadow-lg ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="p-6">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-xl font-semibold tracking-tight text-white ${className}`}>{children}</h3>;
const CardDescription = ({ children }) => <p className="text-sm text-gray-400 mt-1">{children}</p>;
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const Button = ({ children, asChild, size = 'md', variant = 'default', className, ...props }) => {
    const sizeClasses = {
        sm: 'h-9 px-3 rounded-md',
        md: 'h-10 py-2 px-4 rounded-md',
        lg: 'h-11 px-8 rounded-lg text-base',
    };
    const variantClasses = {
        default: 'bg-blue-600 text-white hover:bg-blue-700',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-gray-600 bg-transparent hover:bg-gray-700 hover:text-white',
    };
    const finalClassName = `inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
    
    if (asChild) {
        return React.cloneElement(children, { className: `${finalClassName} ${children.props.className || ''}`, ...props });
    }
    return <button className={finalClassName} {...props}>{children}</button>;
};


// --- Data for the First Aid Section ---
const emergencies = [
    { id: "heartattack", name: "Heart Attack", steps: ["Signs: Crushing pain in center of chest, sweating, shortness of breath, nausea.", "Help the person sit down comfortably, leaning against a wall.", "Call 112 immediately.", "Loosen tight clothing.", "Ask if they have prescribed medication (like Sorbitrate) and help them take it.", "If conscious and not allergic, give one Aspirin (325 mg) to chew slowly.", "Be ready for CPR if they become unresponsive."], govt: "ICMR/AIIMS: Early hospital transfer and immediate ECG monitoring recommended." },
    { id: "cardiacarrest", name: "Cardiac Arrest", steps: ["Signs: Suddenly collapses, unresponsive, not breathing normally.", "Call for help (112) and shout for an AED if available.", "Start Chest Compressions (Hands-Only CPR): Place heel of one hand on the center of the chest, other hand on top.", "Push hard and fast (100-120 compressions per minute).", "Don't stop until help arrives or the person starts to move."], govt: "Govt Protocol: Immediate CPR can double or triple chances of survival. Continue until medical professionals take over." },
    { id: "bleeding", name: "Severe Bleeding", steps: ["Signs: Visible wound with profuse blood flow.", "Wear gloves if available. Have the person lie down.", "Apply direct, firm pressure on the wound with a sterile gauze or clean cloth.", "If bleeding soaks through, add another layer on top. Do NOT remove the original cloth.", "If a limb is injured, elevate it above the heart (unless a fracture is suspected)."], govt: "Govt Protocol: Do not use a tourniquet unless bleeding is life-threatening and cannot be controlled by direct pressure." },
    { id: "burns", name: "Burns", steps: ["Cool the burn immediately under cool (not ice-cold) running water for at least 10-20 minutes.", "Gently remove rings or watches before the area swells.", "Cover the burn loosely with a sterile, non-stick dressing.", "Do NOT apply ice, butter, toothpaste, or any ointments.", "Do NOT break blisters."], govt: "NDMA: For major burns, cover with a clean sheet and seek immediate hospital care. Do not immerse in water." },
    { id: "fracture", name: "Fractures", steps: ["Signs: Severe pain, swelling, deformity, inability to move.", "Tell the person not to move the injured part. Call 112.", "Support the injured area to immobilize it.", "Create a makeshift splint with cardboard or a stick, tied with a cloth.", "Do NOT try to realign the bone."], govt: "MoHFW: Immobilization is key to prevent further injury during transport." },
    { id: "snakebite", name: "Snake Bite", steps: ["Keep the person calm and still to slow venom spread.", "Call 112 immediately. Remember the snake's appearance if possible.", "Have the person lie down with the bite area below heart level.", "Remove tight clothing or jewelry near the bite.", "Do NOT cut the wound, suck venom, apply a tourniquet, or apply ice."], govt: "MoHFW: Immediate transfer to a hospital with Anti-Snake Venom (ASV) is the only effective treatment." },
    { id: "dogbite", name: "Dog/Animal Bite", steps: ["Wash the wound thoroughly with soap and running water for at least 15 minutes.", "Apply a clean dressing to stop minor bleeding.", "Go to a hospital immediately for Tetanus and Rabies vaccination.", "If possible, safely observe the animal for signs of rabies."], govt: "Govt Protocol: Post-exposure prophylaxis (PEP) for rabies is mandatory and life-saving." },
    { id: "choking", name: "Choking", steps: ["Signs: Clutching throat, unable to talk or cough, turning blue.", "Perform the Heimlich Maneuver: Stand behind the person, wrap arms around their waist.", "Make a fist and place it just above their navel.", "Grasp your fist with your other hand and perform quick, upward thrusts.", "Continue until the object is dislodged or help arrives."], govt: "Govt Protocol: Encourage coughing first. If ineffective, proceed with abdominal thrusts." },
    { id: "fainting", name: "Fainting", steps: ["Lay the person down on their back.", "Elevate their legs 8-12 inches to restore blood flow to the brain.", "Loosen tight clothing. Ensure fresh air.", "Wipe their face with a wet cloth. Do not splash water.", "Once conscious, do not let them get up too quickly."], govt: "Govt Protocol: If fainting is recurrent or accompanied by other symptoms, a full medical evaluation is necessary." },
    { id: "heatstroke", name: "Heat Stroke", steps: ["Signs: High body temp, red/hot/dry skin, confusion, unconsciousness.", "Call 112 – this is a critical emergency.", "Move the person to a cool, shaded place.", "Cool the person rapidly: spray with cool water or place wet cloths on neck, armpits, and groin.", "Do not give fluids if the person is confused or unconscious."], govt: "NDMA: Rapid cooling is the most critical intervention to prevent organ damage." },
    { id: "stroke", name: "Stroke", steps: ["Remember F.A.S.T: Face drooping, Arm weakness, Speech difficulty, Time to call 112.", "Call 112 immediately. Note the time symptoms began.", "Lay the person on their side with their head slightly raised.", "Do not give them anything to eat or drink."], govt: "MoHFW: 'Golden Hour' is critical; thrombolysis within 4.5 hours of an ischemic stroke can be life-saving." },
    { id: "seizure", name: "Seizures", steps: ["Ease the person to the floor and clear the area of sharp objects.", "Place something soft and flat under their head.", "Turn the person gently onto one side to help them breathe.", "Do NOT put anything in their mouth or try to hold them down.", "Time the seizure and stay with them until they are fully aware."], govt: "Govt Protocol: Most seizures are not emergencies unless they last >5 mins or the person is injured." },
    { id: "drowning", name: "Drowning", steps: ["Call 112. Only attempt a water rescue if you are trained.", "Once on land, check for responsiveness and breathing.", "If not breathing, begin CPR immediately (30 chest compressions, then 2 rescue breaths if trained).", "Continue CPR until help arrives."], govt: "Govt Protocol: All drowning victims should be taken to hospital, even if they seem fine, due to risk of secondary drowning." },
    { id: "electricshock", name: "Electric Shock", steps: ["Do NOT touch the person if they are still in contact with the electrical source.", "Turn off the power source. If not possible, use a dry, non-conductive object (like a wooden stick) to move the source away.", "Call 112. Once safe, check for breathing and begin CPR if needed.", "Treat any burns."], govt: "Govt Protocol: Electrical injuries can cause severe internal damage not visible on the skin. Hospital evaluation is mandatory." },
    { id: "poisoning", name: "Poisoning", steps: ["Call 112 or a Poison Control Center immediately.", "Have the poison container with you to provide information.", "Do NOT induce vomiting unless specifically instructed to do so by a medical professional."], govt: "AIIMS/NPIC: Management is specific to the poison. Never attempt home remedies." },
    { id: "anaphylaxis", name: "Allergic Reaction", steps: ["Signs: Difficulty breathing, swelling of face/tongue, hives, dizziness.", "Call 112 immediately.", "Check if the person has an epinephrine auto-injector (EpiPen). Help them use it.", "Lay the person down and elevate their legs. Loosen tight clothing.", "If they stop breathing, begin CPR."], govt: "MoHFW: Epinephrine is the first-line, life-saving treatment." },
    { id: "headinjury", name: "Head Injury", steps: ["Call 112 if the person is unconscious, confused, vomiting, or has a seizure.", "Keep the person's head and neck still. Do not move them.", "Apply a cold pack to any swollen area.", "Monitor their breathing and consciousness until help arrives."], govt: "Govt Protocol: Any significant head injury requires medical evaluation to rule out internal bleeding." },
    { id: "nosebleed", name: "Nosebleed", steps: ["Have the person sit down and lean forward slightly.", "Pinch the soft part of the nose firmly for 10-15 minutes.", "Breathe through the mouth.", "Apply a cold compress to the bridge of the nose.", "Do NOT tilt the head backward."], govt: "Govt Protocol: If bleeding is severe or doesn't stop after 20 minutes of pressure, seek medical help." },
    { id: "sprain", name: "Sprains & Strains", steps: ["Follow R.I.C.E: Rest, Ice, Compression, Elevation.", "Rest the injured joint.", "Apply an ice pack wrapped in a cloth for 15-20 minutes every 2-3 hours.", "Wrap with an elastic bandage to reduce swelling.", "Elevate the injured limb above heart level."], govt: "Govt Protocol: If you cannot bear weight on the joint or there is a popping sound, see a doctor to rule out a fracture." },
    { id: "hypothermia", name: "Hypothermia", steps: ["Signs: Shivering, slurred speech, drowsiness, confusion.", "Move the person to a warm place. Remove wet clothing and dry them.", "Warm the person gradually with blankets and layers of dry clothing.", "Offer warm, non-alcoholic, non-caffeinated drinks if conscious.", "Do NOT apply direct heat like a heating pad."], govt: "NDMA: Gradual rewarming is critical. Rapid rewarming can cause dangerous heart rhythms." },
];

// --- Component for Dropdown Interaction ---
function EmergencyDropdownGuide() {
    const [selectedId, setSelectedId] = useState("");

    const selectedEmergency = emergencies.find(e => e.id === selectedId);

    const handleSelectChange = (event) => {
        setSelectedId(event.target.value);
    };

    return (
        <Card>
            <CardHeader>
                <label htmlFor="emergency-select" className="block text-sm font-medium text-gray-300 mb-2">Select an Emergency:</label>
                <select 
                    id="emergency-select"
                    onChange={handleSelectChange} 
                    value={selectedId}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                >
                    <option value="" disabled>-- Please choose an emergency --</option>
                    {emergencies.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </select>
            </CardHeader>
            <CardContent className="min-h-[300px] pt-4">
                {selectedEmergency ? (
                    <div>
                        <h2 className="text-2xl font-bold mb-3 text-blue-300">{selectedEmergency.name}</h2>
                        <ol className="list-decimal pl-5 space-y-2 text-gray-200">
                            {selectedEmergency.steps.map((step, idx) => (
                                <li key={idx}>{step}</li>
                            ))}
                        </ol>
                        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                             <p className="text-red-300 font-semibold text-sm"><span className="font-bold">Govt Protocol:</span> {selectedEmergency.govt}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 11h-1.5a1.5 1.5 0 0 0 0 3H15"/><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/><path d="M12 7h.01"/></svg>
                        <p className="mt-2 text-center">Please select an emergency from the dropdown above to see the first aid steps.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- Main Emergency Page Component ---
const emergencyContacts = [
    { name: 'Police', number: '100' },
    { name: 'Fire', number: '101' },
    { name: 'Ambulance', number: '112' },
];

function App() {
    return (
        <div className="flex flex-1 flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto">
            <PageHeader title="Emergency Hub" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="flex flex-col transform hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <AmbulanceIcon className="h-8 w-8 text-red-500" />
                            <CardTitle>Call Ambulance</CardTitle>
                        </div>
                        <CardDescription>
                            Immediately connect to the national emergency number for medical assistance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                        <Button asChild size="lg" variant="destructive" className="w-full md:w-auto">
                            <a href="tel:112">
                                <PhoneIcon className="mr-2 h-5 w-5" /> Call 112 Now
                            </a>
                        </Button>
                    </CardContent>
                </Card>
                
                <Card className="flex flex-col transform hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <HospitalIcon className="h-8 w-8 text-blue-400" />
                            <CardTitle>Nearby Hospitals (24/7)</CardTitle>
                        </div>
                        <CardDescription>
                            Find the nearest 24/7 medical facilities using Google Maps.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex items-center justify-center">
                        <Button asChild size="lg" className="w-full md:w-auto">
                            <a href="https://www.google.com/maps/search/hospital+near+me" target="_blank" rel="noopener noreferrer">
                                <HospitalIcon className="mr-2 h-5 w-5" /> Find Hospitals
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                 <CardTitle className="mb-4 text-2xl">Interactive First Aid Guide</CardTitle>
                <EmergencyDropdownGuide />
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
                                    <PhoneIcon className="mr-2 h-4 w-4" /> {contact.name} ({contact.number})
                                </a>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
