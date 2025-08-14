'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2, ListChecks, Ambulance, HeartPulse, ShieldAlert, Thermometer, Wind, Droplets } from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTravelInsights } from '@/app/actions';
import { type TravelInsightsOutput } from '@/ai/flows/travel-insights';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';

const formSchema = z.object({
  from_district: z.string().min(1, 'Starting destination is required.'),
  to_district: z.string().min(1, 'Final destination is required.'),
  travel_date: z.date({ required_error: 'Date of travel is required.' }),
  mode: z.enum(['road', 'rail', 'air']),
});

const ChecklistItem = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3">
      <div className="mt-1 h-4 w-4 rounded-sm border border-primary flex-shrink-0" />
      <span className="text-sm">{children}</span>
    </div>
);

const RiskReason = ({ children }: { children: React.ReactNode }) => {
    let Icon = ShieldAlert;
    if (typeof children === 'string') {
        const text = children.toLowerCase();
        if (text.includes('rain')) Icon = Droplets;
        if (text.includes('aqi')) Icon = Wind;
        if (text.includes('dengue') || text.includes('typhoid')) Icon = HeartPulse;
    }
    return (
        <li className="flex items-center gap-3">
            <Icon className="h-4 w-4 text-destructive" />
            <span className="text-sm">{children}</span>
        </li>
    );
};


export default function TravelForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TravelInsightsOutput | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      from_district: 'Gonda',
      to_district: 'Lucknow',
      mode: 'road',
      travel_date: new Date(new Date().setDate(new Date().getDate() + 7)), // Default to one week from now
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const input = {
        ...values,
        travel_date: format(values.travel_date, 'yyyy-MM-dd'),
      };
      const res = await getTravelInsights(input);
      setResult(res);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate travel insights.',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  const getRiskColor = (band: TravelInsightsOutput['band'] | undefined) => {
    switch(band) {
        case 'LOW': return 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30';
        case 'MODERATE': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
        case 'HIGH': return 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30';
        default: return 'bg-secondary';
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Trip</CardTitle>
        <CardDescription>
          Enter your travel details for a personalized health and safety report.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from_district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gonda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="to_district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Lucknow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="travel_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Travel</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        {isClient && (
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                            initialFocus
                          />
                        )}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a travel mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="road">Road</SelectItem>
                        <SelectItem value="rail">Rail</SelectItem>
                        <SelectItem value="air">Air</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                'Get Travel Report'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {loading && (
          <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )}
      {result && (
        <CardContent className="space-y-6 pt-6">
            <div className="p-4 border rounded-lg space-y-4">
                <p className="text-sm font-medium text-center text-muted-foreground">{result.header}</p>
                <div className="text-center">
                    <Badge className={cn("text-lg px-4 py-1", getRiskColor(result.band))}>{result.risk}</Badge>
                </div>
                
                {result.reasons.length > 0 && (
                     <div>
                        <h4 className="font-semibold mb-2 text-sm">Primary Risk Factors:</h4>
                        <ul className="space-y-2">
                           {result.reasons.map((reason, i) => <RiskReason key={i}>{reason}</RiskReason>)}
                        </ul>
                    </div>
                )}
            </div>

            <Alert variant="default" className="bg-primary/5 border-primary/20">
                <HeartPulse className="h-4 w-4" />
                <AlertTitle>Personalized Advice</AlertTitle>
                <AlertDescription>
                    <ul className="list-disc pl-5 space-y-1">
                        {result.advice.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </AlertDescription>
            </Alert>

            <Alert>
                <Ambulance className="h-4 w-4" />
                <AlertTitle>Emergency Info (Destination)</AlertTitle>
                <AlertDescription className="space-y-1">
                    <p><strong>Nearest Hospital:</strong> {result.emergency.hospital}</p>
                    <p><strong>24x7 Pharmacy:</strong> {result.emergency.pharmacy}</p>
                    <p><strong>Ambulance:</strong> {result.emergency.ambulance}</p>
                </AlertDescription>
            </Alert>
            
            <Card>
                <CardHeader className="p-4">
                    <div className="flex items-center gap-2">
                      <ListChecks className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Travel Checklist</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-4">
                    {result.checklist.before.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm mb-2">Before Leaving</h4>
                            <div className="space-y-2">
                                {result.checklist.before.map((item, i) => <ChecklistItem key={i}>{item}</ChecklistItem>)}
                            </div>
                        </div>
                    )}
                     {result.checklist.on_way.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm mb-2">On the Way</h4>
                            <div className="space-y-2">
                                {result.checklist.on_way.map((item, i) => <ChecklistItem key={i}>{item}</ChecklistItem>)}
                            </div>
                        </div>
                    )}
                     {result.checklist.on_arrival.length > 0 && (
                        <div>
                            <h4 className="font-semibold text-sm mb-2">On Arrival</h4>
                            <div className="space-y-2">
                                {result.checklist.on_arrival.map((item, i) => <ChecklistItem key={i}>{item}</ChecklistItem>)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

        </CardContent>
      )}
    </Card>
  );
}
