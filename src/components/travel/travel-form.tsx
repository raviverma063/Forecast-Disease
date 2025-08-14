'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTravelInsights } from '@/app/actions';
import { type TravelInsightsOutput } from '@/ai/flows/travel-insights';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  destinationA: z.string().min(1, 'Starting destination is required.'),
  destinationB: z.string().min(1, 'Final destination is required.'),
  dateOfTravel: z.date({ required_error: 'Date of travel is required.' }),
  modeOfTravel: z.enum(['train', 'bus', 'car', 'air']),
  symptoms: z.string().optional(),
});

const MOCK_DATA = {
  userProfile: 'Generally healthy individual, no known allergies.',
  localDiseaseData: 'Low risk of communicable diseases in both areas.',
  travelDesignatedPlaceInfo: 'Both destinations are urban areas with good healthcare facilities.',
  environmentWeatherData: 'Weather expected to be warm and sunny.',
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
      destinationA: 'Mumbai',
      destinationB: 'Pune',
      modeOfTravel: 'car',
      symptoms: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const input = {
        ...values,
        dateOfTravel: format(values.dateOfTravel, 'yyyy-MM-dd'),
        ...MOCK_DATA,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Trip</CardTitle>
        <CardDescription>
          Enter your travel details to get AI-powered health and safety insights.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="destinationA"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., District A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationB"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., District B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dateOfTravel"
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
                name="modeOfTravel"
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
                        <SelectItem value="train">Train</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="air">Air</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="symptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Symptoms (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., fever, cough, cold" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Get Insights'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent className="space-y-4">
          <Alert>
            <AlertTitle>Health Risks</AlertTitle>
            <AlertDescription>{result.healthRisks}</AlertDescription>
          </Alert>
          <Alert>
            <AlertTitle>Optimal Travel Times</AlertTitle>
            <AlertDescription>{result.optimalTravelTimes}</AlertDescription>
          </Alert>
          <Alert variant="default" className="bg-primary/5 border-primary/20">
            <AlertTitle>Additional Recommendations</AlertTitle>
            <AlertDescription>{result.additionalRecommendations}</AlertDescription>
          </Alert>
        </CardContent>
      )}
    </Card>
  );
}
