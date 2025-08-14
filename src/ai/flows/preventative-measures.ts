'use server';

/**
 * @fileOverview Generates preventative measures based on live location and disease risk factors.
 *
 * - preventativeMeasures - A function that generates preventative measures.
 * - PreventativeMeasuresInput - The input type for the preventativeMeasures function.
 * - PreventativeMeasuresOutput - The return type for the preventativeMeasures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PreventativeMeasuresInputSchema = z.object({
  liveLocation: z.string().describe('The user\'s current location.'),
  diseaseRiskFactors: z.string().describe('The user\'s disease risk factors.'),
});
export type PreventativeMeasuresInput = z.infer<typeof PreventativeMeasuresInputSchema>;

const PreventativeMeasuresOutputSchema = z.object({
  preventativeMeasures: z.string().describe('AI-generated preventative measures.'),
});
export type PreventativeMeasuresOutput = z.infer<typeof PreventativeMeasuresOutputSchema>;

export async function preventativeMeasures(input: PreventativeMeasuresInput): Promise<PreventativeMeasuresOutput> {
  return preventativeMeasuresFlow(input);
}

const prompt = ai.definePrompt({
  name: 'preventativeMeasuresPrompt',
  input: {schema: PreventativeMeasuresInputSchema},
  output: {schema: PreventativeMeasuresOutputSchema},
  prompt: `Based on the user\'s live location ({{{liveLocation}}}) and disease risk factors ({{{diseaseRiskFactors}}}), generate a list of preventative measures the user can take to protect their health.`,
});

const preventativeMeasuresFlow = ai.defineFlow(
  {
    name: 'preventativeMeasuresFlow',
    inputSchema: PreventativeMeasuresInputSchema,
    outputSchema: PreventativeMeasuresOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
