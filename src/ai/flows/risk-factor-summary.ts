'use server';

/**
 * @fileOverview Provides a summarized view of personalized disease risk factors.
 *
 * - riskFactorSummary - A function that generates a summary of disease risk factors.
 * - RiskFactorSummaryInput - The input type for the riskFactorSummary function.
 * - RiskFactorSummaryOutput - The return type for the riskFactorSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskFactorSummaryInputSchema = z.object({
  profileData: z.string().describe('User profile data including health history and preferences.'),
  location: z.string().describe('Current location of the user (e.g., city, state).'),
  weatherData: z.string().describe('Current weather data for the user’s location.'),
  localHealthData: z.string().describe('Local health data for the last week.'),
  governmentHealthData: z.string().describe('Government public health data (IDSP).'),
  environmentRiskData: z.string().describe('Environmental risk data (air quality, potential crops).'),
});
export type RiskFactorSummaryInput = z.infer<typeof RiskFactorSummaryInputSchema>;

const RiskFactorSummaryOutputSchema = z.object({
  riskSummary: z.string().describe('A summarized view of personalized disease risk factors.'),
  riskLevel: z
    .enum(['High', 'Moderate', 'Low'])
    .describe('Overall risk level based on the analyzed data.'),
  recommendations: z.string().describe('Preventative measures based on the risk factors.'),
});
export type RiskFactorSummaryOutput = z.infer<typeof RiskFactorSummaryOutputSchema>;

export async function riskFactorSummary(input: RiskFactorSummaryInput): Promise<RiskFactorSummaryOutput> {
  return riskFactorSummaryFlow(input);
}

const riskFactorSummaryPrompt = ai.definePrompt({
  name: 'riskFactorSummaryPrompt',
  input: {schema: RiskFactorSummaryInputSchema},
  output: {schema: RiskFactorSummaryOutputSchema},
  prompt: `You are an AI health assistant providing a summarized view of personalized disease risk factors for the user.\n\nAnalyze the following data to generate a risk summary, determine the overall risk level (High, Moderate, or Low), and provide personalized recommendations.\n\nUser Profile Data: {{{profileData}}}\nLocation: {{{location}}}\nWeather Data: {{{weatherData}}}\nLocal Health Data: {{{localHealthData}}}\nGovernment Health Data (IDSP): {{{governmentHealthData}}}\nEnvironmental Risk Data: {{{environmentRiskData}}}\n\nRisk Summary:\nRisk Level: \nRecommendations: `,
});

const riskFactorSummaryFlow = ai.defineFlow(
  {
    name: 'riskFactorSummaryFlow',
    inputSchema: RiskFactorSummaryInputSchema,
    outputSchema: RiskFactorSummaryOutputSchema,
  },
  async input => {
    const {output} = await riskFactorSummaryPrompt(input);
    return output!;
  }
);
