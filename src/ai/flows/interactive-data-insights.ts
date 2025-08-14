'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating interactive data insights related to health trends and risks.
 *
 * @exports interactiveDataInsights - A function that takes user data and generates interactive data insights.
 * @exports InteractiveDataInsightsInput - The input type for the interactiveDataInsights function.
 * @exports InteractiveDataInsightsOutput - The output type for the interactiveDataInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InteractiveDataInsightsInputSchema = z.object({
  profileData: z.string().describe('User profile data including demographics and health history.'),
  locationData: z.string().describe('Current location data including GPS coordinates.'),
  weatherData: z.string().describe('Current weather data for the user location.'),
  season: z.string().describe('Current season of the year.'),
  localHealthData: z.string().describe('Local health data for the last week.'),
  governmentHealthData: z.string().describe('Government public health data including outbreak and disease data.'),
  environmentRiskData: z.string().describe('Environment and vector risk data including air quality and major potential crops.'),
  query: z.string().describe('Specific question or request from the user regarding health trends and risks.'),
});

export type InteractiveDataInsightsInput = z.infer<typeof InteractiveDataInsightsInputSchema>;

const InteractiveDataInsightsOutputSchema = z.object({
  insight: z.string().describe('Generated interactive data insight based on the input data and user query.'),
  visualizationSuggestion: z.string().describe('Suggestion for visualizing the insight in an interactive chart or graph format.'),
});

export type InteractiveDataInsightsOutput = z.infer<typeof InteractiveDataInsightsOutputSchema>;

export async function interactiveDataInsights(input: InteractiveDataInsightsInput): Promise<InteractiveDataInsightsOutput> {
  return interactiveDataInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interactiveDataInsightsPrompt',
  input: {schema: InteractiveDataInsightsInputSchema},
  output: {schema: InteractiveDataInsightsOutputSchema},
  prompt: `You are an AI assistant that generates interactive data insights related to health trends and risks.

  Based on the following data and the user's query, generate an insightful response and suggest a suitable visualization method.

  User Profile Data: {{{profileData}}}
  Location Data: {{{locationData}}}
  Weather Data: {{{weatherData}}}
  Season: {{{season}}}
  Local Health Data: {{{localHealthData}}}
  Government Health Data: {{{governmentHealthData}}}
  Environment Risk Data: {{{environmentRiskData}}}
  User Query: {{{query}}}

  Insight:
  Visualization Suggestion:`,
});

const interactiveDataInsightsFlow = ai.defineFlow(
  {
    name: 'interactiveDataInsightsFlow',
    inputSchema: InteractiveDataInsightsInputSchema,
    outputSchema: InteractiveDataInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
