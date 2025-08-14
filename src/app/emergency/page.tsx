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
                <a href="https://www.google.com/maps/search/24/7+hospitals+near+me" target="_blank" rel="noopener noreferrer">
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
              <h4 className="font-semibold">For Minor Cuts & Scrapes:</h4>
              <ol className="list-decimal list-inside space-y-1 mt-1">
                <li>Wash your hands thoroughly with soap and water.</li>
                <li>Gently clean the wound with cool water and mild soap.</li>
                <li>Apply gentle pressure with a clean cloth to stop bleeding.</li>
                <li>Apply an antibiotic ointment.</li>
                <li>Cover the wound with a sterile bandage or dressing.</li>
              </ol>
            </div>
            <p className="font-bold text-destructive">For serious injuries, seek professional medical help immediately.</p>
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
