'use server';
/**
 * @fileOverview A Genkit flow to enhance technical assistance requests.
 *
 * - enhanceTechnicalRequest - A function that enhances a technical request using AI.
 * - EnhanceTechnicalRequestInput - The input type for the enhanceTechnicalRequest function.
 * - EnhanceTechnicalRequestOutput - The return type for the enhanceTechnicalRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceTechnicalRequestInputSchema = z.object({
  technicalRequest: z
    .string()
    .describe('The original technical assistance request from the customer.'),
});
export type EnhanceTechnicalRequestInput = z.infer<
  typeof EnhanceTechnicalRequestInputSchema
>;

const EnhanceTechnicalRequestOutputSchema = z.object({
  enhancedRequest: z
    .string()
    .describe('The AI-enhanced, formal, and professional technical request.'),
});
export type EnhanceTechnicalRequestOutput = z.infer<
  typeof EnhanceTechnicalRequestOutputSchema
>;

export async function enhanceTechnicalRequest(
  input: EnhanceTechnicalRequestInput
): Promise<EnhanceTechnicalRequestOutput> {
  return enhanceTechnicalRequestFlow(input);
}

const enhanceTechnicalRequestPrompt = ai.definePrompt({
  name: 'enhanceTechnicalRequestPrompt',
  input: {schema: EnhanceTechnicalRequestInputSchema},
  output: {schema: EnhanceTechnicalRequestOutputSchema},
  system: 'You are an expert engineer specializing in power generators. Your task is to rephrase and enhance technical assistance requests to be clear, formal, and professional. Ensure the rephrased request maintains all original technical details but improves clarity and formality.',
  prompt: `Original technical request: """{{{technicalRequest}}}"""`,
});

const enhanceTechnicalRequestFlow = ai.defineFlow(
  {
    name: 'enhanceTechnicalRequestFlow',
    inputSchema: EnhanceTechnicalRequestInputSchema,
    outputSchema: EnhanceTechnicalRequestOutputSchema,
  },
  async input => {
    const {output} = await enhanceTechnicalRequestPrompt(input);
    return output!;
  }
);
